class Seat {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.type = 0;
    this.selected = false;
  }
}

class SeatSelector {
  constructor(rows, cols, canvasId) {
    this.rows = rows;
    this.cols = cols;
    this.canvas = document.getElementById(canvasId);
    this.cvs = canvas.getContext("2d");
    this.seatSize = 20;
    this.margin = 5;

    this.seats = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        row[j] = new Seat(i, j);
      }
      this.seats[i] = row;
    }
    console.log(this.seats);

    this.canvas.width = cols * this.seatSize + (cols + 1) * this.margin;
    this.canvas.height = rows * this.seatSize + (rows + 1) * this.margin;
    this.canvas.style.display = "block";

    this.canvas.addEventListener("mousedown", (event) => {
      let rect = this.canvas.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;
      this.startPoint = { x, y };
    });

    this.canvas.addEventListener("mouseup", (event) => {
      let rect = this.canvas.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;
      this.endPoint = { x, y };

      let selectRect = {
        x1: Math.min(this.startPoint.x, this.endPoint.x),
        y1: Math.min(this.startPoint.y, this.endPoint.y),
        x2: Math.max(this.startPoint.x, this.endPoint.x),
        y2: Math.max(this.startPoint.y, this.endPoint.y),
      };
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          let seat = this.seats[i][j];
          let top = i * this.seatSize + (i + 1) * this.margin;
          let bottom = (i + 1) * this.seatSize + (i + 1) * this.margin;
          let left = j * this.seatSize + (j + 1) * this.margin;
          let right = (j + 1) * this.seatSize + (j + 1) * this.margin;
          if (
            top > selectRect.y2 ||
            left > selectRect.x2 ||
            bottom < selectRect.y1 ||
            right < selectRect.x1
          ) {
          } else {
            if (seat.type == 0) {
              seat.selected = !seat.selected;
            }
          }
        }
      }
      this.draw();
    });
  }
  draw() {
    this.cvs.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let seat = this.seats[i][j];

        if (seat.type == 1) {
          this.cvs.fillStyle = "#e53e31";
          this.cvs.fillRect(
            j * this.seatSize + (j + 1) * this.margin,
            i * this.seatSize + (i + 1) * this.margin,
            this.seatSize,
            this.seatSize
          );
          continue;
        }
        if (seat.type == 2) {
          this.cvs.fillStyle = "#edb0ba";
          this.cvs.fillRect(
            j * this.seatSize + (j + 1) * this.margin,
            i * this.seatSize + (i + 1) * this.margin,
            this.seatSize,
            this.seatSize
          );
          continue;
        }
        if (seat.type == 3) {
          this.cvs.fillStyle = "#ccc";
          this.cvs.fillRect(
            j * this.seatSize + (j + 1) * this.margin,
            i * this.seatSize + (i + 1) * this.margin,
            this.seatSize,
            this.seatSize
          );
          continue;
        }
        if (seat.selected) {
          this.cvs.fillStyle = "#36D";
          this.cvs.fillRect(
            j * this.seatSize + (j + 1) * this.margin,
            i * this.seatSize + (i + 1) * this.margin,
            this.seatSize,
            this.seatSize
          );
        } else {
          this.cvs.fillStyle = "#36D9";
          this.cvs.fillRect(
            j * this.seatSize + (j + 1) * this.margin,
            i * this.seatSize + (i + 1) * this.margin,
            this.seatSize,
            this.seatSize
          );
        }
      }
    }
  }
  seatNoSelect() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let seat = this.seats[i][j];
        seat.selected = false;
      }
    }
    this.draw();
  }
  seatSelectToNormalSeats(seatType) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let seat = this.seats[i][j];
        if (seat.selected) seat.type = seatType;
        seat.selected = false;
      }
    }
    this.draw();
  }
  getSeatTemplateJsonString() {
    let rowNum = 0;
    for (let i = 0; i < this.rows; i++) {
      let rowData = this.seats[i];
      let filterdRowData = rowData.filter((item) => {
        return item.type != 2;
      });
      if (filterdRowData.length == 0) {
        continue;
      }
      rowNum += 1;
      let colNum = 0;
      for (let j = 0; j < this.cols; j++) {
        let seat = this.seats[i][j];
        if (seat.type == 0) {
          throw "还有未分配的座位";
        } else if (seat.type == 1) {
          colNum += 1;
          seat.name = `${rowNum}排${colNum}号`;
        }
      }
    }
    console.log(this.seats);
    let str = JSON.stringify(this.seats);
    return str;
  }
  getSeatCount() {
    let count = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let seat = this.seats[i][j];
        if (seat.type == 1) {
          count++;
        }
      }
    }
    return count;
  }
}

export default SeatSelector;
