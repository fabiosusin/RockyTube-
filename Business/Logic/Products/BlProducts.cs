using DAO.Databases;
using Repository.Settings;
using System;
using Utils.Extensions.StringExtensions;
using Microsoft.AspNetCore.Hosting;
using Utils.Extensions.Files.Images;
using Business.Services.Exceptions;
using Repository.Extensions;
using MongoDB.Driver.Builders;
using DAO.Input;
using System.Linq;

namespace Business.Logic.Products
{
    public class BlProducts : BlAbstract<Product>
    {
        protected BlSaleProducts BlSaleProducts;

        public BlProducts(IMasterPieceDatabaseSettings settings) : base(settings) => BlSaleProducts = new BlSaleProducts(settings);

        public override void EntityValidation(Product product)
        {
            if (product == null)
                throw new ValidationResponseException("Ocorreu um erro ao enviar os dados para o servidor!");

            if (string.IsNullOrEmpty(product.UserId))
                throw new ValidationResponseException("Você deve estar logado para cadastrar um produto!");

            if (string.IsNullOrEmpty(product.Name))
                throw new ValidationResponseException("Informe o Nome do Produto!");

            if (product.Type == ProductType.Default)
                throw new ValidationResponseException("Informe o Tipo do Produto!");

            if (product.Type == ProductType.Donation)
                return;

            if (product.Price == 0)
                throw new ValidationResponseException("Informe o Preço do Produto!");
        }

        public override void EntityDeleteSanitize(Product product)
        {
            if (product == null)
                throw new ValidationResponseException("Ocorreu um erro ao enviar os dados para o servidor!");

            if (BlSaleProducts.GetProducts(new FiltersSaleProducts { Id = product.Id })?.FirstOrDefault()!= null)
                throw new ValidationResponseException("Este Produto está vinculado a uma venda!");
        }

        public override void EntitySanitize(Product entity)
        {
            var category = MongoDatabase.GetCollection<Category>().FindOne(Query<Category>.EQ(x => x.Name, entity.AuxiliaryProperties?.CategoryName));
            if (category == null)
            {
                category = new Category(entity.AuxiliaryProperties.CategoryName);
                category.Id = MongoDatabase.GetCollection<Category>().Add(category);
            }

            entity.CategoryId = category.Id;
            entity.Image = SaveImage.SaveListResolutions(entity.AuxiliaryProperties?.PictureBase64);
            entity.NameWithoutAccents = entity.Name.RemoveCharactersWithAccent();
        }

        

    }

}

