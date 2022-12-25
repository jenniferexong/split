using System.ComponentModel.DataAnnotations;
using Split.Models;
using Split.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class PeopleController : ControllerBase
{
    private readonly IPeopleRepository _peopleRepository;

    public PeopleController(IPeopleRepository peopleRepository)
    {
        _peopleRepository = peopleRepository;
    }

    [HttpGet]
    [Route("")] // /people
    public async Task<IResult> GetAll()
    {
        var people = await _peopleRepository.GetAll();

        return Results.Ok<IEnumerable<Person>>(people);
    }

    [HttpGet]
    [Route("{id}")] // /people/:id
    public async Task<IResult> GetById([Required] int id)
    {
        var person = await _peopleRepository.GetById(id);
        if (person is null)
        {
            return Results.NotFound();
        }

        return Results.Ok<Person>(person);
    }

    [HttpPost]
    [Route("")] // /people
    public async Task<IResult> Create([FromBody] AddPersonRequest request)
    {
        var addedPerson = await _peopleRepository.Add(request.FirstName, request.LastName, request.Email);

        return Results.Created<Person>($"/people/{addedPerson.Id}", addedPerson);
    }
}

public class AddPersonRequest
{
    public AddPersonRequest(string firstName, string lastName, string email)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
    }

    [Required]
    public string FirstName { get; set; }

    [Required]
    public string LastName { get; set; }

    [Required]
    public string Email { get; set; }
}