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
using Utils.Extensions.Files.Videos;

namespace Business.Logic.Movies
{
    public class BlMovies : BlAbstract<Movie>
    {

        public BlMovies(IRockyTubeDatabaseSettings settings) : base(settings) { }

        public override void EntityValidation(Movie movie)
        {
            if (movie == null)
                throw new ValidationResponseException("Ocorreu um erro ao enviar os dados para o servidor!");

            if (string.IsNullOrEmpty(movie.Name))
                throw new ValidationResponseException("Informe o Nome do Filme!");

            if (string.IsNullOrEmpty(movie.Description))
                throw new ValidationResponseException("Informe a Descrição do Filme!");

        }

        public override void EntityDeleteSanitize(Movie movie)
        {
            if (movie == null)
                throw new ValidationResponseException("Ocorreu um erro ao enviar os dados para o servidor!");
        }

        public override void EntitySanitize(Movie entity)
        {
            var category = MongoDatabase.GetCollection<Category>().FindOne(Query<Category>.EQ(x => x.Name, entity.AuxiliaryProperties?.CategoryName));
            if (category == null)
            {
                category = new Category(entity.AuxiliaryProperties.CategoryName);
                category.Id = MongoDatabase.GetCollection<Category>().Add(category);
            }

            entity.CategoryId = category.Id;
            entity.Image = SaveImage.SaveListResolutions(entity.AuxiliaryProperties?.PictureBase64);
            entity.Path = SaveVideo.SaveVideoPath(entity.AuxiliaryProperties?.PathBase64);
            entity.NameWithoutAccents = entity.Name.RemoveCharactersWithAccent();
        }

    }

}

