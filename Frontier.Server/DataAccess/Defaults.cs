namespace Frontier.Server.DataAccess;

using Models;

public class Defaults
{
    MetalDataAccess metalDB = new MetalDataAccess();
    RingSizeDataAccess ringSizeDB = new RingSizeDataAccess();

    public static List<MetalModel> Metals = new List<MetalModel>
        {
            new MetalModel { Name = "Fine Silver", SpecificGravity = 10.64 },
            new MetalModel { Name = "Sterling Silver", SpecificGravity = 10.55 },
            new MetalModel { Name = "Fine Gold", SpecificGravity = 19.36 },
            new MetalModel { Name = "9ct Yellow Gold", SpecificGravity = 11.64 },
            new MetalModel { Name = "14ct Yellow Gold", SpecificGravity = 13.56 },
            new MetalModel { Name = "18ct Yellow Gold", SpecificGravity = 16.04 },
            new MetalModel { Name = "9ct White Gold", SpecificGravity = 13.04 },
            new MetalModel { Name = "14ct White Gold", SpecificGravity = 14.02 },
            new MetalModel { Name = "18ct White Gold", SpecificGravity = 16.59 },
            new MetalModel { Name = "9ct Pink Gold", SpecificGravity = 11.71 },
            new MetalModel { Name = "14ct Pink Gold", SpecificGravity = 14 },
            new MetalModel { Name = "18ct Pink Gold", SpecificGravity = 15.45 },
            new MetalModel { Name = "Platinum", SpecificGravity = 21.24 },
            new MetalModel { Name = "Wax", SpecificGravity = 1 },
        };

    public static List<RingSizeModel> RingSizes = new List<RingSizeModel>
        {
            new RingSizeModel { LetterSize = "A", NumberSize = 0.5, Diameter = 12.04 },
            new RingSizeModel { LetterSize = "B", NumberSize = 1, Diameter = 12.45 },
            new RingSizeModel { LetterSize = "C", NumberSize = 1.5, Diameter = 12.85 },
            new RingSizeModel { LetterSize = "D", NumberSize = 2, Diameter = 13.26 },
            new RingSizeModel { LetterSize = "E", NumberSize = 2.5, Diameter = 13.67 },
            new RingSizeModel { LetterSize = "F", NumberSize = 3, Diameter = 14.07 },
            new RingSizeModel { LetterSize = "G", NumberSize = 3.5, Diameter = 14.48 },
            new RingSizeModel { LetterSize = "H", NumberSize = 4, Diameter = 14.88 },
            new RingSizeModel { LetterSize = "I", NumberSize = 4.5, Diameter = 15.29 },
            new RingSizeModel { LetterSize = "J", NumberSize = 5, Diameter = 15.49 },
            new RingSizeModel { LetterSize = "K", NumberSize = 5.5, Diameter = 15.9 },
            new RingSizeModel { LetterSize = "L", NumberSize = 6, Diameter = 16.31 },
            new RingSizeModel { LetterSize = "M", NumberSize = 6.5, Diameter = 16.71 },
            new RingSizeModel { LetterSize = "N", NumberSize = 7, Diameter = 17.12 },
            new RingSizeModel { LetterSize = "O", NumberSize = 7.5, Diameter = 17.53 },
            new RingSizeModel { LetterSize = "P", NumberSize = 8, Diameter = 17.93 },
            new RingSizeModel { LetterSize = "Q", NumberSize = 8.5, Diameter = 18.34 },
            new RingSizeModel { LetterSize = "R", NumberSize = 9, Diameter = 18.75 },
            new RingSizeModel { LetterSize = "S", NumberSize = 9.5, Diameter = 19.15 },
            new RingSizeModel { LetterSize = "T", NumberSize = 10, Diameter = 19.56 },
            new RingSizeModel { LetterSize = "U", NumberSize = 10.5, Diameter = 19.96 },
            new RingSizeModel { LetterSize = "V", NumberSize = 11, Diameter = 20.37 },
            new RingSizeModel { LetterSize = "W", NumberSize = 11.5, Diameter = 20.78 },
            new RingSizeModel { LetterSize = "X", NumberSize = 12, Diameter = 21.18 },
            new RingSizeModel { LetterSize = "Y", NumberSize = 12.5, Diameter = 21.59 },
            new RingSizeModel { LetterSize = "Z", NumberSize = 13, Diameter = 21.79 },
        };

    public async Task LoadMetalDefaults()
    {
        foreach (MetalModel metal in Metals)
        {
            MetalModel existingMetal = await metalDB.GetMetal(metal.Name);
            if (existingMetal == null)
            {
                await metalDB.CreateMetal(metal);
            }
            else
            {
                metal.Id = existingMetal.Id;
                await metalDB.UpdateMetal(metal);
            }
        }
    }

    public async Task LoadRingSizeDefaults()
    {
        foreach (RingSizeModel ringSize in RingSizes)
        {
            RingSizeModel existingRingSize = await ringSizeDB.GetRingSize(ringSize.LetterSize, ringSize.NumberSize);
            if (existingRingSize == null)
            {
                await ringSizeDB.CreateRingSize(ringSize);
            }
            else
            {
                ringSize.Id = existingRingSize.Id;
                await ringSizeDB.UpdateRingSize(ringSize);
            }
        }
    }
}
