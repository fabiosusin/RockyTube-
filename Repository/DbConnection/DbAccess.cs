using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Repository.Settings;

namespace Repository.DbConnection
{
    public class DbAccess
    {
        public MongoDatabase MongoDatabase;
        public DbAccess(IRockyTubeDatabaseSettings settings)
        {
            BsonSerializer.RegisterSerializationProvider(new BsonSerializationProvider());
            var client = new MongoClient(settings.ConnectionString);
            MongoDatabase = client.GetServer().GetDatabase(settings.DatabaseName);
        }
    }
}
