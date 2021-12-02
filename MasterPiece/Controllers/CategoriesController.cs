using Business.Logic.Movies;
using DAO.Databases;
using DAO.Input;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Settings;

namespace RockyTube.Controllers
{
    [Route("api/[controller]"), AllowAnonymous]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly BlCategories _blCategoriesList;
        public CategoriesController(IRockyTubeDatabaseSettings settings) => _blCategoriesList = new BlCategories(settings);

        [HttpPost, Route("Save")]
        public IActionResult Save([FromBody] Category body) => Ok(_blCategoriesList.Save(body));

        [HttpGet, Route("Get")]
        public IActionResult Get(string id) => Ok(_blCategoriesList.GetById(id));

        [HttpPost, Route("Migration")]
        public IActionResult Migration([FromBody] CategoryMigrationInput migration)
        {
            _blCategoriesList.CategoriesMigration(migration);
            return Ok();
        }

        [HttpPost, Route("List")]
        public IActionResult List([FromBody] FiltersCategories filters) => Ok(_blCategoriesList.List(filters));

        [HttpPost, Route("Get-Categories")]
        public IActionResult Categories([FromBody] FiltersCategories filters) => Ok(_blCategoriesList.GetCategories(filters));
    }
}
