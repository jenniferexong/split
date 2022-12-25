using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Split.Models;
using Split.Services.Interfaces;

[ApiController]
[Route("[controller]")]
public class StoresController : ControllerBase
{
    private readonly IStoresRepository _storesRepository;

    public StoresController(IStoresRepository storesRepository)
    {
        _storesRepository = storesRepository;
    }

    [HttpGet]
    [Route("")] // /stores
    public async Task<ActionResult<IEnumerable<Store>>> GetAll()
    {
        var stores = await _storesRepository.GetAll();

        return Ok(stores);
    }

    [HttpGet]
    [Route("{id}")] // /stores/:id
    public async Task<ActionResult<Store>> GetById([Required] int id)
    {
        var store = await _storesRepository.GetById(id);
        if (store is null)
        {
            return NotFound();
        }

        return Ok(store);
    }

    [HttpPost]
    [Route("")] // /stores
    public async Task<ActionResult<Store>> Add([FromBody] AddStoreRequest request)
    {
        var addedStore = await _storesRepository.Add(request.Name);

        return CreatedAtAction(nameof(GetById), new { id = addedStore.Id }, addedStore);
    }
}

public class AddStoreRequest
{
    public AddStoreRequest(string name)
    {
        Name = name;
    }

    [Required]
    public string Name { get; set; }
}