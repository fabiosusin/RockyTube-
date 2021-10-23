using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DAO.Databases
{
    public class Base : IBase
    {

        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
    }
}
