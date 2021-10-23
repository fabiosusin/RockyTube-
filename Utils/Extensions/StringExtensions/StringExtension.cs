using System.Net.Mail;
using System.Text.RegularExpressions;

namespace Utils.Extensions.StringExtensions
{
    public static class StringExtension
    {

        public static string RemoveCharactersWithAccent(this string text)
        {
            if (string.IsNullOrEmpty(text))
                return text;

            var symbolTable = new char[][]
            {
                new char[] { 'a', 'à', 'á', 'ä', 'â', 'ã' },
                new char[] { 'c', 'ç' },
                new char[] { 'e', 'è', 'é', 'ë', 'ê' },
                new char[] { 'i', 'ì', 'í', 'ï', 'î' },
                new char[] { 'o', 'ò', 'ó', 'ö', 'ô', 'õ' },
                new char[] { 'u', 'ù', 'ú', 'ü', 'û' },
                new char[] { 'A', 'À', 'Á', 'Ä', 'Â', 'Ã' },
                new char[] { 'C', 'Ç' },
                new char[] { 'E', 'È', 'É', 'Ë', 'Ê' },
                new char[] { 'I', 'Ì', 'Í', 'Ï', 'Î' },
                new char[] { 'O', 'Ò', 'Ó', 'Ö', 'Ô', 'Õ' },
                new char[] { 'U', 'Ù', 'Ú', 'Ü', 'Û' },
            };

            for (var i = 0; i < symbolTable.Length; i++)
            {
                for (var j = 1; j < symbolTable[i].Length; j++)
                {
                    text = text.Replace(symbolTable[i][j], symbolTable[i][0]);
                }
            }
            return text;
        }
    }

}
