import { Component, OnInit, Inject } from '@angular/core';
import { DishService } from '../services/dish.service';
import { LeaderService } from '../services/leader.service';
import { PromotionService } from '../services/promotion.service';
import { flyInOut, expand } from '../animations/app.animations';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      expand()
    ]
})

export class MenuComponent implements OnInit {

  dishes;
  leaders;
  promotions;
  errMess: string;

  constructor( private dishService : DishService,
    private leaderService: LeaderService,
    private promotionService : PromotionService,
    @Inject('BaseURL') private BaseURL) { 
  }
  ngOnInit() {
    this.dishService.getDishes().subscribe((dishes) => this.dishes = dishes,
    errmess => this.errMess = <any>errmess);  
    
    this.leaderService.getLeaders().subscribe((leaders) => this.leaders = leaders,
    errmess => this.errMess = <any>errmess);

    this.promotionService.getPromotions().subscribe((promotions) => this.promotions = promotions,
    errmess => this.errMess = <any> errmess);
  }
}
