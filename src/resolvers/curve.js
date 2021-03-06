module.exports = class Curve {
  /**
   * @param {Object} _dsa the dsa instance to access data stores
   */
  constructor(_dsa) {
    this.ABI = _dsa.ABI;
    this.address = _dsa.address;
    this.tokens = _dsa.tokens;
    this.web3 = _dsa.web3;
    this.instance = _dsa.instance;
    this.math = _dsa.math;
    this.dsa = _dsa;
  }

  /**
   * get properly formatted Curve position details
   * @param {string} address the owner address
   */
  async getPosition(address) {
    var _address;
    !address ? (_address = this.instance.address) : (_address = address);

    var _obj = {
      protocol: "curve",
      method: "getPosition",
      args: [_address],
    };

    return new Promise((resolve, reject) => {
      return this.dsa
        .read(_obj)
        .then((res) => {
          let _position = {};
          _position.curveBalance = this.tokens.toDecimal(res[0], "curvesusd");
          _position.totalSupply = this.tokens.toDecimal(res[1], "curvesusd");
          _position.userShare =
            this.tokens.toDecimal(res[2], "curvesusd") * 100;
          _position.daiPoolBalance = this.tokens.toDecimal(res[3], "DAI");
          _position.usdcPoolBalance = this.tokens.toDecimal(res[4], "USDC");
          _position.usdtPoolBalance = this.tokens.toDecimal(res[5], "USDT");
          _position.susdPoolBalance = this.tokens.toDecimal(res[6], "SUSD");
          resolve(_position);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * returns buy/dest amount and unit Amount
   * @param buyToken buy token symbol
   * @param sellToken sell token symbol
   * @param sellAmt sell token amount in decimal
   * @param slippage slippage of trade
   */
  async getBuyAmount(buyToken, sellToken, sellAmt, slippage) {
    let _slippage = !slippage ? 10 ** 16 : slippage * 10 ** 16;
    _slippage = String(this.math.bigNumInString(_slippage));

    var _obj = {
      protocol: "curve",
      method: "getBuyAmount",
      args: [
        this.tokens.info[buyToken.toLowerCase()].address,
        this.tokens.info[sellToken.toLowerCase()].address,
        this.tokens.fromDecimal(sellAmt, sellToken),
        this.math.bigNumInString(_slippage),
      ],
    };

    return new Promise((resolve, reject) => {
      return this.dsa
        .read(_obj)
        .then((res) => {
          var _res = {
            buyAmt: this.tokens.toDecimal(res[0], buyToken),
            buyAmtRaw: res[0],
            unitAmt: res[1],
          };
          resolve(_res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * returns curve token amount and unit Amount
   * @param token deposit token symbol
   * @param amt deposit token amount
   * @param slippage slippage to deposit
   */
  async getDepositAmount(token, amt, slippage) {
    let _slippage = !slippage ? 10 ** 16 : slippage * 10 ** 16;
    _slippage = String(this.math.bigNumInString(_slippage));

    var _obj = {
      protocol: "curve",
      method: "getDepositAmount",
      args: [
        this.tokens.info[token.toLowerCase()].address,
        this.tokens.fromDecimal(amt, token),
        this.math.bigNumInString(_slippage),
      ],
    };

    return new Promise((resolve, reject) => {
      return this.dsa
        .read(_obj)
        .then((res) => {
          var _res = {
            curveAmt: this.tokens.toDecimal(res[0], "curvesusd"),
            curveAmtRaw: res[0],
            unitAmt: res[1],
          };
          resolve(_res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * returns curve token amount and unit Amount
   * @param token withdraw token symbol
   * @param amt withdraw token amount
   * @param slippage slippage to withdraw
   */
  async getWithdrawAmount(token, amt, slippage) {
    let _slippage = !slippage ? 10 ** 16 : slippage * 10 ** 16;
    _slippage = String(this.math.bigNumInString(_slippage));

    var _obj = {
      protocol: "curve",
      method: "getWithdrawAmount",
      args: [
        this.tokens.info[token.toLowerCase()].address,
        this.tokens.fromDecimal(amt, token),
        this.math.bigNumInString(_slippage),
      ],
    };

    return new Promise((resolve, reject) => {
      return this.dsa
        .read(_obj)
        .then((res) => {
          var _res = {
            curveAmt: this.tokens.toDecimal(res[0], "curvesusd"),
            curveAmtRaw: res[0],
            unitAmt: res[1],
          };
          resolve(_res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
};
