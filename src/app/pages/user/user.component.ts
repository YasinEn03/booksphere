import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { UserInfo, UserService } from '../../service/user-service';

@Component({
    selector: 'app-user',
    imports: [
        CommonModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatListModule,
    ],
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
    userInfo: UserInfo | null = null;

    constructor(private userService: UserService) {}

    ngOnInit() {
        this.userInfo = this.userService.getUserInfo();
    }
}
