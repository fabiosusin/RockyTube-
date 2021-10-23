using DAO.Input;
using MongoDB.Bson.Serialization.Attributes;

namespace DAO.Databases
{
    public class Product : Base
    {
        public string UserId { get; set; }
        public string Name { get; set; }
        public string NameWithoutAccents { get; set; }
        public string Description { get; set; }
        public string CategoryId { get; set; }
        public ImageFormat Image { get; set; }
        public decimal Price { get; set; }
        public decimal Balance { get; set; }
        public ProductType Type { get; set; }
        public ProductStatus Status { get; set; }

        [BsonIgnore]
        public AuxiliaryProperties AuxiliaryProperties { get; set; } = new AuxiliaryProperties();
    }

    public class AuxiliaryProperties
    {
        public string CategoryName { get; set; }
        public string PictureBase64 { get; set; }
        public string ImageUrl { get; set; }
    }

    public class Image
    {
        public string Webp { get; set; }
    }

    public enum ProductType
    {
        Default,
        Donation,
        ForSale
    }

    public enum ProductStatus
    {
        Default,
        Valid,
        Sold,
        Invalid
    }
}


