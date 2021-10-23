using Business.Logic.Sales;
using DAO.Input;
using DAO.Input.Filters;
using Microsoft.AspNetCore.Mvc;
using Repository.Settings;
using System.Collections.Generic;

namespace MasterPiece.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {

        private readonly BlSales _blSales;
        public SalesController(IMasterPieceDatabaseSettings settings)
        {
            _blSales = new BlSales(settings);
        }

        [HttpPost, Route("Create")]
        public IActionResult Create([FromBody] SaleInput input)
        {
            _blSales.Create(input);
            return Ok();
        }

        [HttpPost, Route("Total")]
        public IActionResult Total([FromBody] List<string> ids) => Ok(_blSales.GetSaleTotal(ids));

        [HttpPost, Route("Get")]
        public IActionResult Get([FromBody] FiltersSales filters) => Ok(_blSales.List(filters));
    }
}
