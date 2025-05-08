<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Visitor Registration - International Machine Tools Exhibition - IMTOF</title>

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-11463845171">
</script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'AW-11463845171');
</script>


<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '859282986196768');
fbq('track', 'PageView');
</script>



<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 20px;
  }
  .container_1 {
   background-image: url('./images1/letter.jpg');
   max-width: 600px;
    margin: auto;
    background: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  .container {
    max-width: 600px;
    margin: auto;
    background: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  input[type="text"],
  input[type="email"],
  input[type="tel"] {
    background: #CCD7FA;
    width: 100%;
    padding: 10px;
    margin: 5px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  input[type="checkbox"] {
    margin-right: 5px;
  }
  input[type="submit"] {
    background-color: #4A75FA;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  input[type="submit"]:hover {
    background-color: #2142AB;
  }
</style>


<style>
body {
  background-image: url('./images/sidebar/background.jpeg');
  background-repeat: no-repeat;
  background-attachment: fixed;  
  background-size: cover;
}
  
  .header {
    background-color: #143497;
    color: white;
    padding: 10px;
    text-align: center;
    font-size: 24px;
  }

</style>



</head>
<body>






<head id="head" >
    <div class="container_1" >
	
    <a  class="whats-app" href="https://wa.me/7200976882" target="_blank">
        <i class="fa fa-whatsapp my-float"></i>
    </a>

    
	<img src="images/sidebar/international_mc.png" class="img-fluid" style="width:30%;  margin-top:30px;" alt="India's Largest International Machine Tools Exhibition">

	<a href="https://www.mmtma.in/"><img src="images/sidebar/mmtma_logo.png" class="img-fluid" style="width:15%; top:20px; margin-top:35px;" alt="MMTMA Logo"></a> &#160;  &#160;  &#160;  
	
	
	&#160; 
	<img src="images/logos/hsg.png" class="img-fluid" style="width:15%; margin-top:20px;">
	&#160;  &#160;  
	<img src="images/logos/cimtof_logo.png" class="img-fluid" style="width:20%; margin-top:20px;">


	</div>
	</head>
  
  
<div class="container">

<div class="header">
  <h2>Visitor Registration Form</h2>
</div>
<br><br>
  <form id="myForm" action="forms/send_visit_form.php" method="post" onsubmit="return validateForm()">
    <label for="name">Name</label>
    <input type="text" id="name" name="name" placeholder="Your name.." required>

    <label for="designation">Designation</label>
    <input type="text" id="designation" name="desi" placeholder="Your designation.." required>

    <label for="company">Company Name</label>
    <input type="text" id="company" name="comp_name" placeholder="Your company name.." required>

    <label for="phone">Mobile</label>
    <input type="tel" id="phone" name="mobile" placeholder="Your phone number.." pattern="(\+[0-9]{1,3})?[0-9]{10,14}" required>

    <label for="email">Email</label>
    <input type="email" id="email" name="email" placeholder="Your email.." required>
<br>
    <label style="color:#143497;" for="products"><b>Interested Products Categories</b></label><br><br>
    <input type="checkbox" id="product1" name="cat1" value="Machine Tools">
    <label for="product1">Machine Tools</label>
    <input type="checkbox" id="product2" name="cat2" value="Robotics & Automation">
    <label for="product2">Robotics & Automation</label>

    <input type="checkbox" id="product3" name="cat3" value="Metrology">
    <label for="product3">Metrology</label>
    <input type="checkbox" id="product4" name="cat4" value="Others">
    <label for="product4">Others</label>
<br><br>

		<div class="input-container" style="display:none;"> 
    			<input type="date" class="form-control" name="date1" style="width:80%" value="<?php echo date('Y-m-d'); ?>" > 
		</div>

		<div class="input-container" style="display:none;"> 
    			<input type="text" class="form-control" name="time1" style="width:80%" value="<?php date_default_timezone_set("asia/kolkata"); echo date('h:i:sa'); ?>" > 
		</div>



    <input type="submit" value="Submit" name="submit" style="width:25%;">
  </form>
</div>

<script>
  function validateForm() {
    var name = document.getElementById("name").value;
    var designation = document.getElementById("designation").value;
    var company = document.getElementById("company").value;
    var phone = document.getElementById("phone").value;
    var email = document.getElementById("email").value;
    var product1 = document.getElementById("product1").checked;
    var product2 = document.getElementById("product2").checked;
    var product3 = document.getElementById("product3").checked;
    var product4 = document.getElementById("product4").checked;
    
    if (name == "" || designation == "" || company == "" || phone == "" || email == "" || (!product1 && !product2 && !product3 && !product4)) {
      alert("Please fill in all fields and select at least one product");
      return false;
    }
    return true;
  }
</script>

</body>
</html>
