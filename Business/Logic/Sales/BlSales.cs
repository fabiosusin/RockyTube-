using Business.Logic.Products;
using Business.Logic.Users;
using Business.Services.Exceptions;
using DAO.Databases;
using DAO.Input;
using DAO.Input.Filters;
using DAO.Output;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using Repository.Settings;
using System.Collections.Generic;
using System.Linq;
using static Business.Logic.Products.BlSaleProducts;

namespace Business.Logic.Sales
{
    public class BlSales : BlAbstract<Sale>
    {
        protected BlUsers BlUsers;
        protected BlProductsList BlProductsList;
        protected BlSaleProducts BlSaleProducts;
        public BlSales(IMasterPieceDatabaseSettings settings) : base(settings)
        {
            BlUsers = new BlUsers(settings);
            BlProductsList = new BlProductsList(settings);
            BlSaleProducts = new BlSaleProducts(settings);
        }

        private IMongoQuery QueryFilters(FiltersSales filters)
        {
            var query = new List<IMongoQuery>();
            if (!string.IsNullOrEmpty(filters?.UserId))
                query.Add(Query<Sale>.EQ(x => x.UserId, filters.UserId));

            return !query.Any() ? Query.And(Query.Empty) : Query.And(query);
        }

        public void SaveSaleValidation(SaleInput sale)
        {
            if (sale == null)
                throw new ValidationResponseException("Ocorreu um erro ao enviar os dados pro Servidor!");

            if (sale.InvalidAddress())
                throw new ValidationResponseException("Ajuste seus dados de endereço");

            var products = BlProductsList.GetProducts(new FiltersProducts { Ids = sale.ProductsId });
            if (products?.Any(x => x.UserId == sale.UserId) ?? false)
                throw new ValidationResponseException("Você não pode comprar os seus próprios produtos");

            var invalidStatus = new List<ProductStatus> { ProductStatus.Invalid, ProductStatus.Sold };
            if (products?.Any(x => invalidStatus.Contains(x.Status)) ?? false)
                throw new ValidationResponseException($"Os produtos {string.Join(", ", products.Where(x => invalidStatus.Contains(x.Status)).Select(x => x.Name))} se encontram inválidos para venda");

        }

        public decimal GetSaleTotal(List<string> ids)
        {
            var products = BlProductsList.GetProducts(new FiltersProducts { Ids = ids });
            return !(products?.Any() ?? false) ? 0 : products.Sum(x => x.Price);
        }

        public void Create(SaleInput input)
        {
            SaveSaleValidation(input);
            var sale = Save(new Sale { Destination = input.Destination, UserId = input.UserId, Total = GetSaleTotal(input.ProductsId) });
            BlSaleProducts.SaveProducts(new SaveSaleProductsInput { SaleId = sale.Id, ProductsId = input.ProductsId });
        }

        public IEnumerable<SaleOutput> List(FiltersSales filters)
        {
            var sales = GetSales(filters);
            if (!(sales?.Any() ?? false))
                return null;

            var result = new List<SaleOutput>();
            foreach(var sale in sales)
            {
                sale.UserName = BlUsers.GetById(sale.UserId)?.Name;
                result.Add(new SaleOutput
                {
                    Sale = sale,
                    Products = BlProductsList.List(new FiltersProducts { Status = ProductStatus.Sold, Ids = BlSaleProducts.GetProducts(new FiltersSaleProducts { SaleId = sale.Id })?.Select(x => x.ProductId).ToList() }).ToList()
                });
            }

            return result;
        }

        public IEnumerable<Sale> GetSales(FiltersSales filters)
        {
            if (filters.Page > 0 && filters.Limit == 0)
                filters.Limit = 25;

            return filters.Limit > 0 ? Collection.Find(QueryFilters(filters)).SetSkip(filters.Limit * (filters.Page > 0 ? filters.Page - 1 : 0)).SetLimit(filters.Limit) : Collection.Find(QueryFilters(filters));
        }
    }
}
