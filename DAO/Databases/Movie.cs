using DAO.Input;
using MongoDB.Bson.Serialization.Attributes;

namespace DAO.Databases
{
    public class Movie : Base
    {
        public string Name { get; set; }
        public string NameWithoutAccents { get; set; }
        public string Description { get; set; }
        public string CategoryId { get; set; }
        public string Path { get; set; }
        public ImageFormat Image { get; set; }

        [BsonIgnore]
        public AuxiliaryProperties AuxiliaryProperties { get; set; } = new AuxiliaryProperties();
    }

    public class AuxiliaryProperties
    {
        public string CategoryName { get; set; }
        public string PictureBase64 { get; set; }
        public string PathBase64 { get; set; }
        public string ImageUrl { get; set; }
        public bool AddedToList { get; set; }
    }
}


