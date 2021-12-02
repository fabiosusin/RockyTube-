using DAO.Input;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using DAO.Attributes;
using System.Reflection;
using System.Text.RegularExpressions;

namespace Utils.Extensions.Files.Videos
{
    public class SaveVideo
    {
        private const string FilesPath = "/ClientApp/src/assets";
        private const string DbFilesPath = "/../../assets";
        private const string VideosPath = "/MoviesVideos";

        public static string SaveVideoPath(string base64)
        {
            if (string.IsNullOrEmpty(base64))
                return null;

            try
            {
                return GetImageConverted(base64);
            }
            catch (Exception e)
            {
                return null;
            }
        }

        private static string GetImageConverted(string base64)
        {
            var videoByteArray = ConvertBase64ToByteArray(base64);
            if (videoByteArray == null)
                return null;

            return SaveImageOnServer(videoByteArray);
        }

        private static byte[] ConvertBase64ToByteArray(string base64)
        {
            if (string.IsNullOrEmpty(base64))
                return null;

            return Convert.FromBase64String(new Regex("data:video\\/.*;base64,").Replace(base64, ""));
        }

        private static string SaveImageOnServer(byte[] input)
        {
            if (input?.Length <= 0)
                return null;


            var dir = Directory.GetCurrentDirectory();
            var path = FilesPath + VideosPath;
            var dbpath = DbFilesPath+ VideosPath;

            var samePath = "/" + Guid.NewGuid().ToString() + ".mp4";
            var result = dbpath + samePath;
            
            var videoPath = dir + path + samePath;

            if (!Directory.Exists(dir +path))
                Directory.CreateDirectory(dir + path);

            try
            {
                File.WriteAllBytes(videoPath, input);
            }
            catch
            {
                return null;
            }

            return result;
        }

    }
}
