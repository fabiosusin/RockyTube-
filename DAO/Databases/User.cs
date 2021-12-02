using MongoDB.Bson.Serialization.Attributes;

namespace DAO.Databases
{
    public class User : Base
    {
        public string Name { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Cpf { get; set; }
        public bool Blocked { get; set; }
        public Card Card { get; set; }

        [BsonIgnore]
        public bool Admin { get; set; }
        [BsonIgnore]
        public string ConfirmPassword { get; set; }

        public User() { }

        public User(string name, string pass, bool admin)
        {
            Name = name;
            Password = pass;
            Admin = admin;
        }

    }

    public class Card
    {
        public long Number { get; set; }
        public string Name { get; set; }
        public int SecurityCode { get; set; }
        public string ValidityDate { get; set; }
    }
}
