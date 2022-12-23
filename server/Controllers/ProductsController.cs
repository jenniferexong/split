using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Split.Models;
using Split.Models.Requests.Product;

[ApiController]
[Route("[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ProductsRepository _productsRepository;

    public ProductsController(ProductsRepository productsRepository)
    {
        _productsRepository = productsRepository;
    }

    [HttpGet(Name = nameof(GetAll))]
    public async Task<ActionResult<IEnumerable<Product>>> GetAll()
    {
        var products = await _productsRepository.GetAll();

        return Ok(products);
    }

    [HttpGet(Name = nameof(GetById))]
    [Route("{id}")]
    public async Task<ActionResult<Product>> GetById([Required] int id)
    {
        var product = await _productsRepository.GetById(id);
        if (product is null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    [HttpPost(Name = nameof(Add))]
    public async Task<ActionResult<Product>> Add([FromBody] AddProductRequest request)
    {
        var addedProduct = await _productsRepository.Add(request.Name);

        return CreatedAtAction(nameof(GetById), new { id = addedProduct.Id }, addedProduct);
    }
}