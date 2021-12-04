using Business.Services.Exceptions;
using DAO.Databases;
using DAO.Input;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using Repository.Settings;
using System.Collections.Generic;
using System.Linq;

namespace Business.Logic.Movies
{
    public class BlUserMoviesList : BlAbstract<UserMovieList>
    {

        protected BlMoviesList BlMoviesList;
        public BlUserMoviesList(IRockyTubeDatabaseSettings settings) : base(settings)
        {
            BlMoviesList = new BlMoviesList(settings);
        }

        public override void EntityValidation(UserMovieList movie)
        {
            if (string.IsNullOrEmpty(movie?.UserId) || string.IsNullOrEmpty(movie?.MovieId))
                throw new ValidationResponseException("Ocorreu um erro ao enviar os dados para o servidor!");
        }

        private static IMongoQuery QueryFilters(FiltersMovies filters)
        {
            var query = new List<IMongoQuery>();
            if (!string.IsNullOrEmpty(filters?.UserId))
                query.Add(Query<UserMovieList>.EQ(x => x.UserId, filters.UserId));

            return !query.Any() ? Query.And(Query.Empty) : Query.And(query);
        }

        public IEnumerable<UserMovieList> List(FiltersMovies filters)
        {
            if (string.IsNullOrEmpty(filters?.UserId))
                throw new ValidationResponseException("Ocorreu um erro ao enviar os dados para o Servidor!");

            return filters?.Limit > 0 ? Collection.Find(QueryFilters(filters)).SetSkip(filters.Limit * (filters.Page > 0 ? filters.Page - 1 : 0)).SetLimit(filters.Limit) : Collection.Find(QueryFilters(filters));
        }

        public IEnumerable<Movie> GetUserMoviesList(FiltersMovies filters) => BlMoviesList.List(new FiltersMovies { UserId = filters.UserId, Ids = List(filters)?.Select(x => x.MovieId).ToList() });

        public override void Delete(UserMovieList input)
        {
            if (string.IsNullOrEmpty(input?.UserId) || string.IsNullOrEmpty(input?.MovieId))
                throw new ValidationResponseException("Ocorreu um erro ao enviar os dados para o servidor!");

            var data = Collection.FindOne(Query.And(Query<UserMovieList>.EQ(x => x.UserId, input.UserId), Query<UserMovieList>.EQ(x => x.MovieId, input.MovieId)));
            if (data == null)
                throw new ValidationResponseException("Ocorreu um erro ao remover filme da lista!");
            
            base.Delete(data);
        }

    }
}
