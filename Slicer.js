class Slicer { //contains information about current spears and amounts they sliced off
	//will maybe contain circle's whereabounts to throw spears, but not now
	//for now spear is momentary
	constructor(speed, center, radius, width, height) {
		this.slices=[];
		this.suspended_slices = [];
		this.speed = speed;
		console.log(speed);
		this.center = center;
		this.radius = radius;
		this.width = width;
		this.height = height;
		this.start_time = Date.now();
		this.last_update_time = Date.now();
	}


	step() {
		var delta = (Date.now()- this.last_update_time)/1000;
		for (var i=0; i< this.slices.length; i++) {
    		this.slices[i] = incrementAngle(this.slices[i],delta*this.speed * Math.PI / 180);
  		}
  		for (var i=0; i< this.suspended_slices.length; i++) {
    		this.suspended_slices[i] += delta * this.speed * this.radius/10;
    		
  		}
  		for (var s of this.suspended_slices)
  			if (s >= this.height - this.center.y) {
  				this.slices.push(0);
    			this.suspended_slices.splice(this.suspended_slices.indexOf(s),1);
  			}
  		this.last_update_time = Date.now();
	}

	catch() {
		this.suspended_slices.push(0);
	}

	drawSpear(ctx,head,tail, end_flag) {
	ctx.beginPath();
	ctx.moveTo(head.x, head.y); 
    ctx.lineTo(tail.x,tail.y);  
    ctx.stroke(); 

    
    //spear head
    if (end_flag) {
	    var head_1={"x":head.x+(head.x-tail.x)*0.2,"y":head.y+(head.y-tail.y)*0.2};
	    var head_2={"x":head.x+(head.y-tail.y)*0.1,"y":head.y-(head.x-tail.x)*0.1};
	    var head_3={"x":head.x-(head.y-tail.y)*0.1,"y":head.y+(head.x-tail.x)*0.1};
	    ctx.moveTo(head_1.x,head_1.y);
	    ctx.lineTo(head_2.x,head_2.y);
	    ctx.lineTo(head_3.x,head_3.y);
	    ctx.lineTo(head_1.x,head_1.y);
	    
	    ctx.fill();	
	}
}

	draw(ctx) {
		for (var slice of this.slices) {
			var point = {x:this.center.x+this.radius * Math.cos(3/2*Math.PI+slice),
				y:this.center.y-this.radius * Math.sin(3/2*Math.PI+slice)}
		    this.drawSpear(ctx, this.center, point, false);  
		    
  		}

  		for (var ss of this.suspended_slices) {
  			var sss = {x : this.width/2, y: this.height - ss};
  			this.drawSpear(ctx, sss, {x: sss.x, y: sss.y+this.radius}, true);
  		}


	}

	getSlicing() {
		if (this.slices.length<2) return []
		var tmp_slices = this.slices.slice();
		tmp_slices.sort();
		var res = [];
		for (var i=0; i<tmp_slices.length;i++) {
			var r = (tmp_slices[(i+1)%tmp_slices.length]-tmp_slices[i]) / (2 * Math.PI);
			if (r < 0) r +=1;
			res.push(r.toFixed(2));
		}
		console.log(res);
		return res;
	}

	checkPrecision(goalSlicing, epsilon) {
		var currentSlicing = this.getSlicing();
		var nth_goal_in_current = [];
		var nth_current_taken = [];
		for (var i = 0; i < goalSlicing.length; i++) nth_goal_in_current[i] = -1;
		for (var i = 0; i < currentSlicing.length; i++) nth_current_taken[i] = -1;
		var flag = 0;
		var precision = 0;
		for (var i = 0; i < goalSlicing.length; i++) {
			for (var j = 0; j < currentSlicing.length; j++) {
				if (nth_current_taken[j]>-1) continue;
				if (Math.abs(goalSlicing[i]-currentSlicing[j]) < epsilon) {
					nth_goal_in_current[i] = j;
					nth_current_taken[j] = i;
					flag +=1;
					precision += Math.abs(goalSlicing[i]-currentSlicing[j]);
					break;
				}
			}
		}
		return {matched: (flag == goalSlicing.length), matches: nth_goal_in_current, matches_inverse: nth_current_taken, totalCuts: currentSlicing.length, precision: precision/goalSlicing.length}
	}

	gameOver() {
		isGameOn=false;

	}

	resize(radius, center, width, height) {
		this.radius=radius;
		this.center=center;
		this.width=width;
		this.height=height;
	}


}