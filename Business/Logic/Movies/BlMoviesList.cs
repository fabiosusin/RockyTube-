using DAO.Databases;
using DAO.Input;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using Repository.Extensions;
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
            if (filters == null)
                return Query.And(Query.Empty);

            var query = new List<IMongoQuery>();
            if (!string.IsNullOrEmpty(filters.CategoryId))
                query.Add(Query<Movie>.EQ(x => x.CategoryId, filters.CategoryId));

            if (filters.HasPicture)
                query.Add(Query<Movie>.NE(x => x.Image, null));

            if (!string.IsNullOrEmpty(filters.MovieName))
                query.Add(Query<Movie>.Matches(x => x.Name, $"(?i).*{string.Join(".*", Regex.Split(filters.MovieName, @"\s+").Select(x => Regex.Escape(x)))}.*"));

            if (filters.Ids?.Any() ?? false)
                query.Add(Query<Movie>.In(x => x.Id, filters.Ids));

            if (!query.Any())
                return Query.And(Query.Empty);

            return Query.And(query);
        }

        public List<Movie> List(FiltersMovies filters)
        {
            var movies = GetMovies(filters).ToList();
            if (!(movies?.Any() ?? false))
                return null;

            var userMoviesListIds = !string.IsNullOrEmpty(filters?.UserId) ? MongoDatabase.GetCollection<UserMovieList>().Find(Query<UserMovieList>.EQ(x=> x.UserId, filters.UserId))?.Select(x => x.MovieId) : null;
            foreach (var movie in movies)
            {
                movie.AuxiliaryProperties.AddedToList = userMoviesListIds?.Contains(movie.Id) ?? false;
                movie.AuxiliaryProperties.ImageUrl = movie.Image?.GetImage(ListResolutionsSize.Url512, FileType.Jpeg);
            }

            return movies;
        }

        public IEnumerable<Movie> GetMovies(FiltersMovies filters)
        {
            if (filters != null && filters.Page > 0 && filters.Limit == 0)
                filters.Limit = 25;

            return filters?.Limit > 0 ? Collection.Find(QueryFilters(filters)).SetSkip(filters.Limit * (filters.Page > 0 ? filters.Page - 1 : 0)).SetLimit(filters.Limit) : Collection.Find(QueryFilters(filters));
        }
    }
}