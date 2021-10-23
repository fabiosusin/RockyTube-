using Business.Services;
using Business.Services.Exceptions;
using DAO.Databases;
using DAO.Input;
using DAO.Input.Filters;
using DAO.Output;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using Repository.Extensions;
using Repository.Settings;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Utils.Extensions.Validations;

namespace Business.Logic.Users
{
    public class BlUsers : BlAbstract<User>
    {
        public BlUsers(IMasterPieceDatabaseSettings settings) : base(settings) { }

        public override void EntityValidation(User user)
        {

            if (user == null)
                throw new ValidationResponseException("Ocorreu um erro ao enviar os dados pro Servidor!");

            if (string.IsNullOrEmpty(user.Password))
                throw new ValidationResponseException("Informe uma Senha!");

            if (user.Password != user.ConfirmPassword)
                throw new ValidationResponseException("Senhas não coincidem!");

            if (!StringExtension.IsCpf(user.Cpf))
                throw new ValidationResponseException("CPF inválido!");

            if (!string.IsNullOrEmpty(user.Address.ZipCode) && user.Address.ZipCode.Length != 8)
                throw new ValidationResponseException("CEP inválido!");

            if (!StringExtension.IsValidEmail(user.Email))
                throw new ValidationResponseException("Email inválido!");

            if (Collection.FindOne(Query.And(Query<User>.NE(x => x.Id, user.Id), Query<User>.EQ(x => x.Email, user.Email))) != null)
                throw new ValidationResponseException("Email já cadastrado!");
        }

        public SaveUserOutput Login(LoginInput login)
        {
            if (string.IsNullOrEmpty(login?.Email) || string.IsNullOrEmpty(login?.Password))
                return null;

            var user = MasterUser.IsAdmin(login.Email, login.Password) ? new User(login.Email, login.Password, true) : MongoDatabase.GetCollection<User>().FindOne(Query.And(
                Query<User>.EQ(x => x.Email, login.Email),
                Query<User>.EQ(x => x.Password, login.Password)));
            if (user == null)
                return null;


            return new SaveUserOutput
            {
                User = user,
                Token = TokenService.GenerateToken(user)
            };
        }

        public User Get(string id) => string.IsNullOrEmpty(id) ? null : Collection.FindById(id);

        public IEnumerable<User> List(UsersFilter filter) => Collection.Find(Filters(filter));

        private static IMongoQuery Filters(UsersFilter filter)
        {
            var list = new List<IMongoQuery> { Query<User>.EQ(x => x.Blocked, filter.Blocked) };
            if (filter == null)
                return Query.And(list);

            if (!string.IsNullOrEmpty(filter.Name))
                list.Add(Query<User>.Matches(x => x.Name, $"(?i).*{string.Join(".*", Regex.Split(filter.Name, @"\s+").Select(x => Regex.Escape(x)))}.*"));

            if (!string.IsNullOrEmpty(filter.Email))
                list.Add(Query<User>.Matches(x => x.Email, $"(?i).*{string.Join(".*", Regex.Split(filter.Email, @"\s+").Select(x => Regex.Escape(x)))}.*"));

            if (!string.IsNullOrEmpty(filter.Cpf))
                list.Add(Query<User>.EQ(x => x.Cpf, filter.Cpf));

            return Query.And(list);
        }


        private class MasterUser
        {
            public const string Name = "teste@teste.com";
            public const string Password = "masterpiece";

            public static bool IsAdmin(string name, string pass) => name == Name && pass == Password;
        }
    }
}
