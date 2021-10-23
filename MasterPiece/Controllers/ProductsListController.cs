
using Business.Logic.Products;
using DAO.Input;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Settings;

namespace MasterPiece.Controllers
{
    [Route("api/[controller]"), AllowAnonymous]
    [ApiController]
    public class ProductsListController : ControllerBase
    {
        private readonly BlProductsList _blProductsList;
        public ProductsListController(IMasterPieceDatabaseSettings settings) => _blProductsList = new BlProductsList(settings);

        [HttpPost, Route("List")]
        public IActionResult List([FromBody] FiltersProducts filtersproduct) => Ok(_blProductsList.List(filtersproduct));
    }
}
