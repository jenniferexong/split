using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Split.Models;
using Split.Models.Requests.Product;
using Split.Services.Interfaces;

[ApiController]
[Route("[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductsRepository _productsRepository;

    public ProductsController(IProductsRepository productsRepository)
    {
        _productsRepository = productsRepository;
    }

    [HttpGet]
    [Route("")] // /products
    public async Task<ActionResult<IEnumerable<Product>>> GetAll()
    {
        var products = await _productsRepository.GetAll();

        return Ok(products);
    }

    [HttpGet]
    [Route("{id}")] // /products/:id
    public async Task<ActionResult<Product>> GetById([Required] int id)
    {
        var product = await _productsRepository.GetById(id);
        if (product is null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    [HttpPost]
    [Route("")] // /products
    public async Task<ActionResult<Product>> Add([FromBody] AddProductRequest request)
    {
        var addedProduct = await _productsRepository.Add(request.Name);

        return CreatedAtAction(nameof(GetById), new { id = addedProduct.Id }, addedProduct);
    }
}