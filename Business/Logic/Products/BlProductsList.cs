using DAO.Databases;
using DAO.Input;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using Repository.Settings;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace Business.Logic.Products
{
    public class BlProductsList : BlAbstract<Product>
    {
        public BlProductsList(IMasterPieceDatabaseSettings settings) : base(settings) { }

        private IMongoQuery QueryFilters(FiltersProducts filters)
        {
            var query = new List<IMongoQuery>();
            if (!string.IsNullOrEmpty(filters.CategoryId))
                query.Add(Query<Product>.EQ(x => x.CategoryId, filters.CategoryId));

            if (!string.IsNullOrEmpty(filters.UserId))
                query.Add(Query<Product>.EQ(x => x.UserId, filters.UserId));

            if (filters.HasPicture)
                query.Add(Query<Product>.NE(x => x.Image, null));

            if (filters.Price > 0)
                query.Add(Query<Product>.EQ(x => x.Price, filters.Price));

            if (!string.IsNullOrEmpty(filters.ProductName))
                query.Add(Query<Product>.Matches(x => x.Name, $"(?i).*{string.Join(".*", Regex.Split(filters.ProductName, @"\s+").Select(x => Regex.Escape(x)))}.*"));

            if (filters.Ids?.Any() ?? false)
                query.Add(Query<Product>.In(x => x.Id, filters.Ids));

            if (filters.Status != ProductStatus.Default)
                query.Add(Query<Product>.EQ(x => x.Status, filters.Status));

            if (filters.InvalidStatus?.Any() ?? false)
                query.Add(Query<Product>.In(x => x.Status, filters.InvalidStatus));

            if (!query.Any())
                return Query.And(Query.Empty);

            return Query.And(query);
        }

        public List<Product> List(FiltersProducts filters)
        {
            if (filters.Status == ProductStatus.Default)
                filters.Status = ProductStatus.Valid;
            var products = GetProducts(filters).ToList();
            if (!(products?.Any() ?? false))
                return null;

            products.ForEach(x => x.AuxiliaryProperties.ImageUrl = x.Image?.GetImage(ListResolutionsSize.Url512, FileType.Jpeg));
            return products;
        }

        public IEnumerable<Product> GetProducts(FiltersProducts filters)
        {
            if (filters.Page > 0 && filters.Limit == 0)
                filters.Limit = 25;

            return filters.Limit > 0 ? Collection.Find(QueryFilters(filters)).SetSkip(filters.Limit * (filters.Page > 0 ? filters.Page - 1 : 0)).SetLimit(filters.Limit) : Collection.Find(QueryFilters(filters));
        }


    }
}