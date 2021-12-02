using DAO.Databases;
using DAO.Input;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using Repository.Settings;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace Business.Logic.Movies
{
    public class BlMoviesList : BlAbstract<Movie>
    {
        public BlMoviesList(IRockyTubeDatabaseSettings settings) : base(settings) { }

        private static IMongoQuery QueryFilters(FiltersMovies filters)
        {
            var query = new List<IMongoQuery>();
            if (!string.IsNullOrEmpty(filters.CategoryId))
                query.Add(Query<Movie>.EQ(x => x.CategoryId, filters.CategoryId));

            if (filters.HasPicture)
                query.Add(Query<Movie>.NE(x => x.Image, null));

            if (!string.IsNullOrEmpty(filters.ProductName))
                query.Add(Query<Movie>.Matches(x => x.Name, $"(?i).*{string.Join(".*", Regex.Split(filters.ProductName, @"\s+").Select(x => Regex.Escape(x)))}.*"));

            if (filters.Ids?.Any() ?? false)
                query.Add(Query<Movie>.In(x => x.Id, filters.Ids));

            if (!query.Any())
                return Query.And(Query.Empty);

            return Query.And(query);
        }

        public List<Movie> List(FiltersMovies filters)
        {
            if (filters.Status == ProductStatus.Default)
                filters.Status = ProductStatus.Valid;
            var products = GetProducts(filters).ToList();
            if (!(products?.Any() ?? false))
                return null;

            products.ForEach(x => x.AuxiliaryProperties.ImageUrl = x.Image?.GetImage(ListResolutionsSize.Url512, FileType.Jpeg));
            return products;
        }

        public IEnumerable<Movie> GetProducts(FiltersMovies filters)
        {
            if (filters.Page > 0 && filters.Limit == 0)
                filters.Limit = 25;

            return filters.Limit > 0 ? Collection.Find(QueryFilters(filters)).SetSkip(filters.Limit * (filters.Page > 0 ? filters.Page - 1 : 0)).SetLimit(filters.Limit) : Collection.Find(QueryFilters(filters));
        }


    }
}