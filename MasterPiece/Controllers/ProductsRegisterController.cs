using Business.Logic.Products;
using DAO.Databases;
using Microsoft.AspNetCore.Mvc;
using Repository.Settings;

namespace MasterPiece.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsRegisterController : ControllerBase
    {
        private readonly BlProducts _blProducts;
        public ProductsRegisterController(IMasterPieceDatabaseSettings settings)
        {
            _blProducts = new BlProducts(settings);
        }

        [HttpPost, Route("Create")]
        public IActionResult Create([FromBody] Product product) => Ok(_blProducts.Save(product));


        [HttpPost, Route("Delete")]
        public IActionResult Delete(string id)
        {
            _blProducts.Delete(_blProducts.GetById(id));
            return Ok();
        }
    }
}

