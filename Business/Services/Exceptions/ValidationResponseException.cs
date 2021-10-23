using System;

namespace Business.Services.Exceptions
{
    public class ValidationResponseException : Exception
    {
        public ValidationResponseException(string message) : base(message) => Value = message;

        public int Status { get; set; } = 500;

        public object Value { get; set; }
    }
}
