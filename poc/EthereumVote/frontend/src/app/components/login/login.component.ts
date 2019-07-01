import { Component, OnInit } from '@angular/core';
import { EthereumConnectorService } from 'src/services/ethereum-connector.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private connector: EthereumConnectorService
  ) { }

  ngOnInit() {
  }

}
