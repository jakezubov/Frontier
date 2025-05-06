namespace Frontier.Server.Functions;

using Models;

public class Defaults
{
    public static readonly List<MetalModel> Metals =
        [
            new MetalModel { Name = "Wax", SpecificGravity = 1, ListIndex = 1 },
            new MetalModel { Name = "Fine Silver", SpecificGravity = 10.64, ListIndex = 2 },
            new MetalModel { Name = "Sterling Silver", SpecificGravity = 10.55, ListIndex = 3 },
            new MetalModel { Name = "Fine Gold", SpecificGravity = 19.36, ListIndex = 4 },
            new MetalModel { Name = "9ct Yellow Gold", SpecificGravity = 11.64, ListIndex = 5 },
            new MetalModel { Name = "14ct Yellow Gold", SpecificGravity = 13.56, ListIndex = 6 },
            new MetalModel { Name = "18ct Yellow Gold", SpecificGravity = 16.04, ListIndex = 7 },
            new MetalModel { Name = "9ct White Gold", SpecificGravity = 13.04, ListIndex = 8 },
            new MetalModel { Name = "14ct White Gold", SpecificGravity = 14.02, ListIndex = 9 },
            new MetalModel { Name = "18ct White Gold", SpecificGravity = 16.59, ListIndex = 10 },
            new MetalModel { Name = "9ct Pink Gold", SpecificGravity = 11.71, ListIndex = 11 },
            new MetalModel { Name = "14ct Pink Gold", SpecificGravity = 14, ListIndex = 12 },
            new MetalModel { Name = "18ct Pink Gold", SpecificGravity = 15.45, ListIndex = 13 },
            new MetalModel { Name = "Platinum", SpecificGravity = 21.24, ListIndex = 14 },
        ];

    public static readonly List<RingSizeModel> RingSizes =
        [
            new RingSizeModel { LetterSize = "A", NumberSize = 0.5, Diameter = 12.04, ListIndex = 1 },
            new RingSizeModel { LetterSize = "B", NumberSize = 1, Diameter = 12.45, ListIndex = 2 },
            new RingSizeModel { LetterSize = "C", NumberSize = 1.5, Diameter = 12.85, ListIndex = 3 },
            new RingSizeModel { LetterSize = "D", NumberSize = 2, Diameter = 13.26, ListIndex = 4 },
            new RingSizeModel { LetterSize = "E", NumberSize = 2.5, Diameter = 13.67, ListIndex = 5 },
            new RingSizeModel { LetterSize = "F", NumberSize = 3, Diameter = 14.07, ListIndex = 6 },
            new RingSizeModel { LetterSize = "G", NumberSize = 3.5, Diameter = 14.48, ListIndex = 7 },
            new RingSizeModel { LetterSize = "H", NumberSize = 4, Diameter = 14.88, ListIndex = 8 },
            new RingSizeModel { LetterSize = "I", NumberSize = 4.5, Diameter = 15.29, ListIndex = 9 },
            new RingSizeModel { LetterSize = "J", NumberSize = 5, Diameter = 15.49, ListIndex = 10 },
            new RingSizeModel { LetterSize = "K", NumberSize = 5.5, Diameter = 15.9, ListIndex = 11 },
            new RingSizeModel { LetterSize = "L", NumberSize = 6, Diameter = 16.31, ListIndex = 12 },
            new RingSizeModel { LetterSize = "M", NumberSize = 6.5, Diameter = 16.71, ListIndex = 13 },
            new RingSizeModel { LetterSize = "N", NumberSize = 7, Diameter = 17.12, ListIndex = 14 },
            new RingSizeModel { LetterSize = "O", NumberSize = 7.5, Diameter = 17.53, ListIndex = 15 },
            new RingSizeModel { LetterSize = "P", NumberSize = 8, Diameter = 17.93, ListIndex = 16 },
            new RingSizeModel { LetterSize = "Q", NumberSize = 8.5, Diameter = 18.34, ListIndex = 17 },
            new RingSizeModel { LetterSize = "R", NumberSize = 9, Diameter = 18.75, ListIndex = 18 },
            new RingSizeModel { LetterSize = "S", NumberSize = 9.5, Diameter = 19.15, ListIndex = 19 },
            new RingSizeModel { LetterSize = "T", NumberSize = 10, Diameter = 19.56, ListIndex = 20 },
            new RingSizeModel { LetterSize = "U", NumberSize = 10.5, Diameter = 19.96, ListIndex = 21 },
            new RingSizeModel { LetterSize = "V", NumberSize = 11, Diameter = 20.37, ListIndex = 22 },
            new RingSizeModel { LetterSize = "W", NumberSize = 11.5, Diameter = 20.78, ListIndex = 23 },
            new RingSizeModel { LetterSize = "X", NumberSize = 12, Diameter = 21.18, ListIndex = 24 },
            new RingSizeModel { LetterSize = "Y", NumberSize = 12.5, Diameter = 21.59, ListIndex = 25 },
            new RingSizeModel { LetterSize = "Z", NumberSize = 13, Diameter = 21.79, ListIndex = 26 },
        ];
}
