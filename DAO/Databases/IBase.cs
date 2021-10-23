using MongoDB.Bson.Serialization.Attributes;

namespace DAO.Databases
{
    public interface IBase
    {
        [BsonId]
        string Id { get; set; }
    }
}