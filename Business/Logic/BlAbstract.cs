using DAO.Databases;
using MongoDB.Driver;
using Repository.DbConnection;
using Repository.Extensions;
using Repository.Settings;

namespace Business.Logic
{
    public class BlAbstract<TEntity>
        where TEntity : IBase
    {

        public MongoDatabase MongoDatabase;
        protected MongoCollection<TEntity> Collection { get; }
        public BlAbstract(IRockyTubeDatabaseSettings settings)
        {
            MongoDatabase = new DbAccess(settings).MongoDatabase;
            Collection = MongoDatabase.GetCollection<TEntity>();
        }

        public virtual void EntityValidation(TEntity entity) { }

        public virtual void EntityDeleteValidation(TEntity entity) { }

        public virtual void EntitySanitize(TEntity entity) { }

        public virtual void EntityDeleteSanitize(TEntity entity) { }

        public virtual TEntity GetById(string id) => MongoDatabase.GetCollection<TEntity>().FindById(id);

        public virtual void Delete(TEntity entity)
        {
            EntityDeleteValidation(entity);
            EntityDeleteSanitize(entity);
            MongoDatabase.GetCollection<TEntity>().RemoveById(entity.Id);
        }

        public virtual TEntity Save(TEntity entity)
        {
            EntityValidation(entity);
            EntitySanitize(entity);

            if (!string.IsNullOrEmpty(entity.Id))
                MongoDatabase.GetCollection<TEntity>().UpdateById(entity);
            else
                MongoDatabase.GetCollection<TEntity>().Add(entity);

            return entity;
        }
    }
}
