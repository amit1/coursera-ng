import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { visibility } from '../animations/app.animations';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    visibility()
  ]
})
export class DishdetailComponent implements OnInit {

  submitReview: FormGroup;
  review: Comment;
  value: number = 5;
  errMess: string;

  @ViewChild('ffrom') feedbackFormDirective;

  reviewErrors = {
    'author':'',
    'comment':''
  };

  reviewValidationMessages = {
    'author' : {
      'required':'Author Name is required',
      'minlength':'Author Name must be at least 2 characters long.',
    },
    'comment' : {
      'required': 'Comment is required'
    }
  }

  constructor(
    private dishService: DishService,
    private route : ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    @Inject('BaseURL') private BaseURL
  ) {
    this.createReviewForm();

    this.submitReview.valueChanges
    .subscribe((data) => this.onReviewValueChange(data));

    this.onReviewValueChange();
   }

  dish : Dish;
  dishIds: string[];
  next: string;
  prev: string;
  dishcopy: Dish;
  visibility = 'shown';

  ngOnInit() {
    this.dishService.getDishIds()
    .subscribe((dishIds => this.dishIds = dishIds));
    this.route.params.pipe(switchMap((params: Params) =>{
      this.visibility = 'hidden';
      return this.dishService.getDish(params['id'])
    }))
    .subscribe((dish) =>{ 
      this.dish = dish;
      this.dishcopy = dish;
      this.setNextPrev(dish.id);
      this.visibility = 'shown';
    },
    errmess => this.errMess = <any>errmess);
  }

  goBack(): void{
    this.location.back();
  }

  setNextPrev(dishId: string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  createReviewForm(){
    this.submitReview = this.formBuilder.group({
      author : ['',[Validators.required, Validators.minLength(2)]],
      rating: '5',
      comment: ['', Validators.required]
    })
  }

  onSubmit(){
    this.review = this.submitReview.value;
    this.review.date = new Date().toISOString();
    this.dishcopy.comments.push(this.review);
    this.dishService.putDish(this.dishcopy)
    .subscribe(dish => { this.dish= dish; this.dishcopy = dish},
      errmess =>{
        this.dish= null;
        this.dishcopy = null;
        this.errMess = <any>errmess}  )
    this.submitReview.reset({
      author: '',
      rating: '5',
      comment:''
    });
    this.feedbackFormDirective.reset();
  }

  onReviewValueChange( data ? : any){
    if(!this.submitReview){
      return;
    }

    const reviewForm = this.submitReview;
    for (const formField in this.reviewErrors){
      if (this.reviewErrors.hasOwnProperty(formField)){
        this.reviewErrors[formField] = "";
        const control = reviewForm.get(formField);
        if(control && control.dirty && !control.valid){
          const messages = this.reviewValidationMessages[formField]; 
          for( const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.reviewErrors[formField] += messages[key] + ' '; 
            }
          }
        }
      }
    }
  }
}

