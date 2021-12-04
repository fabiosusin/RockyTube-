using DAO.Databases;
using Repository.Settings;
using System.Collections.Generic;
using DAO.Output;
using DAO.Input;
using System.Linq;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using System.Text.RegularExpressions;
using Business.Services.Exceptions;
using Repository.Extensions;

namespace Business.Logic.Movies
{
    public class BlCategories : BlAbstract<Category>
    {

        protected BlMoviesList BlProductsList;
        protected BlMoviesList BlProducts;
        public BlCategories(IRockyTubeDatabaseSettings settings) : base(settings)
        {
            BlProductsList = new BlMoviesList(settings);
            BlProducts = new BlMoviesList(settings);
        }

        public override void EntityValidation(Category category)
        {
            if (category == null)
                throw new ValidationResponseException("Ocorreu um erro ao enviar os dados para o Servidor!");

            if (string.IsNullOrEmpty(category.Name))
                throw new ValidationResponseException("Informe o nome da Categoria!");

            if (Collection.FindOne(Query.And(Query<Category>.EQ(x => x.Name, category.Name), Query<Category>.NE(x => x.Id, category.Id))) != null)
                throw new ValidationResponseException("Ja existe uma categoria com este nome");
        }

        public void CategoriesMigration(CategoryMigrationInput input)
        {
            if (string.IsNullOrEmpty(input?.NewCategoryId) || string.IsNullOrEmpty(input?.OldCategoryId))
                throw new ValidationResponseException("Ocorreu um erro ao enviar os dados para o Servidor!");

            var newCategory = Collection.FindById(input.NewCategoryId);
            if (newCategory == null)
                throw new ValidationResponseException("A categoria de destino não foi encontrada!");

            MongoDatabase.GetCollection<Movie>().Update(Query<Movie>.EQ(x => x.CategoryId, input.OldCategoryId), Update<Movie>.Set(x => x.CategoryId, input.NewCategoryId));
            Collection.RemoveById(input.OldCategoryId);
        }

        public IEnumerable<Category> List(FiltersCategories filters) => Collection.Find(QueryFilters(filters));

        public IEnumerable<MovieCategoryOutput> GetCategories(FiltersCategories filters) => List(filters)?.Select(x => new MovieCategoryOutput { Id = x.Id, Name = x.Name, ImageUrl = GetCategoryimage(x.Id), Movies = BlProducts.GetMovies(new FiltersMovies { CategoryId = x.Id })?.Count() ?? 0 }).Where(x => x.Movies >= (filters?.MinItems ?? 1));

        private string GetCategoryimage(string categoryId) => BlProductsList.GetMovies(new FiltersMovies { CategoryId = categoryId, HasPicture = true, Limit = 1 })?.FirstOrDefault()?.Image.GetImage(ListResolutionsSize.Url512, FileType.Jpeg);

        private IMongoQuery QueryFilters(FiltersCategories filters)
        {
            if (filters == null)
                return Query.And(Query.Empty);

            var list = new List<IMongoQuery>();

            if (!string.IsNullOrEmpty(filters.Id))
                list.Add(Query<Category>.EQ(x => x.Id, filters.Id));

            if (!string.IsNullOrEmpty(filters.Name))
                list.Add(Query<Category>.Matches(x => x.Name, $"(?i).*{string.Join(".*", Regex.Split(filters.Name, @"\s+").Select(x => Regex.Escape(x)))}.*"));

            if (!list.Any())
                return Query.And(Query.Empty);

            return Query.And(list);
        }
    }

}

