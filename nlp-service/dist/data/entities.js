"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
let PizzaEntity = class PizzaEntity {
};
__decorate([
    typeorm_1.ObjectIdColumn(),
    __metadata("design:type", typeorm_1.ObjectID)
], PizzaEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], PizzaEntity.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], PizzaEntity.prototype, "priceSmall", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], PizzaEntity.prototype, "priceBig", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Array)
], PizzaEntity.prototype, "ingredients", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], PizzaEntity.prototype, "imageUrl", void 0);
PizzaEntity = __decorate([
    typeorm_1.Entity()
], PizzaEntity);
exports.PizzaEntity = PizzaEntity;
let MenuEntity = class MenuEntity {
};
__decorate([
    typeorm_1.ObjectIdColumn(),
    __metadata("design:type", typeorm_1.ObjectID
    // @Column()
    // remoteId: string
    )
], MenuEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(type => PizzaEntity),
    __metadata("design:type", Array)
], MenuEntity.prototype, "items", void 0);
MenuEntity = __decorate([
    typeorm_1.Entity()
], MenuEntity);
exports.MenuEntity = MenuEntity;
//# sourceMappingURL=entities.js.map