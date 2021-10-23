using DAO.Databases;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using System;

namespace Repository.Extensions
{
    public static class CollectionExtension
    {
        public static void UpdateById(this MongoCollection collection, IBase value)
        {
            if (collection == null)
                throw new ArgumentNullException(nameof(collection));
            if (value == null)
                throw new ArgumentNullException(nameof(value));

            collection.Update(Query<Base>.EQ(x => x.Id, value.Id), Update<IBase>.Replace(value));
        }

        public static void UpdateById<T>(this MongoCollection<T> collection, string id, UpdateBuilder<T> updateBuilder)
        {
            if (collection == null)
                throw new ArgumentNullException(nameof(collection));
            if (id == null)
                throw new ArgumentNullException(nameof(id));
            if (updateBuilder == null)
                throw new ArgumentNullException(nameof(updateBuilder));

            collection.Update(Query<Base>.EQ(x => x.Id, id), updateBuilder);
        }

        public static void RemoveById(this MongoCollection collection, string id)
        {
            if (collection == null)
                throw new ArgumentNullException(nameof(collection));

            collection.Remove(Query<Base>.EQ(x => x.Id, id));
        }

        public static string Upsert<TEntity>(this MongoCollection<TEntity> collection, Base value) where TEntity : Base
        {
            if (collection == null)
                throw new ArgumentNullException(nameof(collection));
            if (value == null)
                throw new ArgumentNullException(nameof(value));

            var currentData = collection.FindById(value.Id);
            if (currentData == null)
                collection.Add(value);
            else
                collection.UpdateById(value);
            return value.Id;
        }

        public static string Add(this MongoCollection collection, IBase value)
        {
            if (collection == null)
                throw new ArgumentNullException(nameof(collection));
            if (value == null)
                throw new ArgumentNullException(nameof(value));

            if (!ObjectId.TryParse(value.Id, out _))
                value.Id = ObjectId.GenerateNewId().ToString();
            collection.Insert(value);
            return value.Id;
        }

        public static TEntity FindById<TEntity>(this MongoCollection<TEntity> collection, string id)
        {
            if (collection == null)
                throw new ArgumentNullException(nameof(collection));

            return ObjectId.TryParse(id, out var _) ? collection.FindOneByIdAs<TEntity>(new ObjectId(id)) : default(TEntity);
        }
    }
}