<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phoneNumber = $inData["phoneNumber"];
	$login = $inData["login"];
	$password = $inData["password"];

	$conn = new mysqli("localhost", "TheGuy", "Group23IsGoated", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt1 = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
		$stmt1->bind_param("s", $login);
		$stmt1->execute();
		$result = $stmt1->get_result();

		$stmt1->close();

		if($row = $result->fetch_assoc())
		{
			returnWithError("Username Taken");
		}
		else
		{
			$stmt2 = $conn->prepare("INSERT into Users (FirstName,LastName,Email,PhoneNumber,Login,Password) VALUES(?,?,?,?,?,?)");
			$stmt2->bind_param("ssssss", $firstName, $lastName, $email, $phoneNumber, $login, $password);
			$stmt2->execute();
			$stmt2->close();

			$stmt3 = $conn->prepare("SELECT * FROM Users WHERE Login=?");
			$stmt3->bind_param("s", $login);
			$stmt3->execute();

			$result3 = $stmt3->get_result();
			$stmt3->close();

			$row3 = $result3->fetch_assoc();
			$id = $row3["ID"];

			returnWithSuccess($id);
		}
		
		$conn->close();

	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":"0","firstName":"","lastName":"","email":"","phoneNumber":"","login":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithSuccess ( $id )
	{
		global $firstName, $lastName, $email, $phoneNumber, $login;
		$retValue ='{"id":"'. $id .'","firstName":"' . $firstName . '","lastName":"' . $lastName . '","email":"' . $email . '","phoneNumber":"' . $phoneNumber . '","login":"' . $login . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>