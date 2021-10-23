using DAO.Input;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using DAO.Attributes;
using System.Reflection;
using System.Text.RegularExpressions;

namespace Utils.Extensions.Files.Images
{
    public class SaveImage
    {
        private const string FilesPath = "/ClientApp/src/assets";
        private const string DbFilesPath = "/../../assets";
        private const string PicturesPath = "/ProductsImages";
        private const string PicturesPathWebp = "/Webp";
        private const string PicturesPathJpeg = "/Jpeg";

        public static ImageFormat SaveListResolutions(string base64)
        {
            if (string.IsNullOrEmpty(base64))
                return null;

            try
            {
                var jpegArray = new ImageResolutions().GetType().GetProperties()
                                    .Where(x => Attribute.IsDefined(x, typeof(ImageResolutionAttribute)));

                var webpArray = new ImageResolutions().GetType().GetProperties()
                                    .Where(x => Attribute.IsDefined(x, typeof(ImageResolutionAttribute)));

                var resultImageList = new List<ResultImage>();
                foreach (var item in jpegArray)
                    resultImageList.Add(GetImageConverted(base64, item.GetCustomAttribute<ImageResolutionAttribute>().Size));

                if (resultImageList == null)
                    return null;

                var instanceJpeg = Activator.CreateInstance(typeof(ImageResolutions));
                var instanceWebp = Activator.CreateInstance(typeof(ImageResolutions));
                foreach (var item in jpegArray)
                    item.SetValue(instanceJpeg, resultImageList.Find(x => x.Size == item.GetCustomAttribute<ImageResolutionAttribute>().Size).ImageJpeg);

                foreach (var item in webpArray)
                    item.SetValue(instanceWebp, resultImageList.Find(x => x.Size == item.GetCustomAttribute<ImageResolutionAttribute>().Size).ImageWebp);

                return new ImageFormat
                {
                    Jpeg = (ImageResolutions)instanceJpeg,
                    Webp = (ImageResolutions)instanceWebp
                };
            }
            catch (Exception e)
            {
                return null;
            }
        }

        private static ResultImage GetImageConverted(string base64, int size)
        {
            var imageByteArray = ConvertBase64ToByteArray(base64);
            if (imageByteArray == null)
                return null;

            var image = GetImageConverted(imageByteArray, size);
            return new ResultImage
            {
                ImageWebp = SaveImageOnServer(new ImageInput { ImageId = image?.Id, Image = image?.ImageWebp, Type = FileType.Webp }),
                ImageJpeg = SaveImageOnServer(new ImageInput { ImageId = image?.Id, Image = image?.ImageJpeg, Type = FileType.Jpeg }),
                Size = size
            };
        }

        private static ResultResizeImage GetImageConverted(byte[] imageContent, int resolution)
        {
            if (!HigherResolutionThanImage(imageContent, resolution))
                return null;

            return new ResultResizeImage
            {
                Id = Guid.NewGuid().ToString(),
                ImageJpeg = ImageTreatment.ResizeImage(imageContent, resolution, resolution, ImageType.Jpeg),
                //ImageWebp = ImageTreatment.ResizeImage(imageContent, resolution, resolution, ImageType.Webp)
            };
        }

        private static bool HigherResolutionThanImage(byte[] imageData, int resolution)
        {
            var img = ImageTreatment.ConvertByteArrayToImage(imageData, ImageType.Jpeg);
            return img?.Height >= resolution || img?.Width >= resolution;
        }

        private static byte[] ConvertBase64ToByteArray(string base64)
        {
            if (string.IsNullOrEmpty(base64))
                return null;

            return Convert.FromBase64String(new Regex("data:image\\/.*;base64,").Replace(base64, ""));
        }

        private static string SaveImageOnServer(ImageInput input)
        {
            if (string.IsNullOrEmpty(input?.ImageId) || input.Image == null)
                return null;


            var dir = Directory.GetCurrentDirectory();
            var path = FilesPath + PicturesPath;
            var dbpath = DbFilesPath+ PicturesPath;

            var folder = input.Type == FileType.Jpeg ? PicturesPathJpeg : PicturesPathWebp;
            var extension = input.Type == FileType.Jpeg ? ".jpeg" : ".webp";
            
            var samePath = folder + "/" + input.ImageId + extension;
            var result = dbpath + samePath;
            
            var imagePath = dir + path + samePath;


            if (!Directory.Exists(dir +path))
                Directory.CreateDirectory(dir + path);

            if (!Directory.Exists(dir + path + folder))
                Directory.CreateDirectory(dir + path + folder);

            try
            {
                var img = System.Drawing.Image.FromStream(new MemoryStream(input.Image));
                img.Save(imagePath, System.Drawing.Imaging.ImageFormat.Jpeg);
            }
            catch
            {
                return null;
            }

            return result;
        }

        private class ImageInput
        {
            public byte[] Image { get; set; }
            public string ImageId { get; set; }
            public FileType Type { get; set; }
        }

        private class ResultImage
        {
            public string ImageWebp { get; set; }
            public string ImageJpeg { get; set; }
            public int Size { get; set; }
        }


        private class ResultResizeImage
        {
            public byte[] ImageWebp { get; set; }
            public byte[] ImageJpeg { get; set; }
            public string Id { get; set; }
        }
    }
}
