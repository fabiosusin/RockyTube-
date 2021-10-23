using DAO.Input;
using System;

namespace DAO.Attributes
{
    [AttributeUsage(AttributeTargets.Property)]
    public class ImageResolutionAttribute : Attribute
    {
        public int Size { get; set; }
        public ImageResolutionAttribute(int size)
        {
            Size = size;
        }

        public ImageResolutionAttribute(ListResolutionsSize size)
        {
            Size = (int)size;
        }

        public ImageResolutionAttribute(NonStandardListResolutionsSize size)
        {
            Size = (int)size;
        }


    }
}
