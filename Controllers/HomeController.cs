using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using googlemaps.Models;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace googlemaps.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        // Creamos la lista de transportes
        var Transportes = new Dictionary<string, string>
        {
            {"DRIVING", "Automovil"},
            {"WALKING", "Caminando"},
            {"BICYCLING", "Bicicleta"}

        };
        var selecList = new SelectList(Transportes, "Key", "Value");

        //Iniciar el modelo a enviar a la lista
        var model = new UbicacionViewModel
        {
            Transportes = selecList,
            Ruta = true
        };
        return View(model);
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
