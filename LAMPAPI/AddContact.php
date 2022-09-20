<?php
	$inData = getRequestInfo();
	
	$userID = $inData["userID"];
	$userFirstName = $inData["userFirstName"];
	$userLastName = $inData["userLastName"];
	$contactFirstName = $inData["contactFirstName"];
	$contactLastName = $inData["contactLastName"];
	$contactEmail = $inData["contactEmail"];
	$contactPhoneNumber = $inData["contactPhoneNumber"];

	$conn = new mysqli("localhost", "TheGuy", "Group23IsGoated", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt1 = $conn->prepare("SELECT * FROM Users WHERE ID=? AND FirstName=? AND LastName=?");
		$stmt1->bind_param("iss", $userID, $userFirstName, $userLastName);
		$stmt1->execute();
		$result1 = $stmt1->get_result();
		$stmt1->close();

		if($row1 = $result1->fetch_assoc())
		{
			$stmt2 = $conn->prepare("SELECT * FROM Contacts WHERE UserID=? AND ContactFirstName=? AND ContactLastName=? AND ContactEmail=? AND ContactPhoneNumber=?");
			$stmt2->bind_param("issss", $userID, $contactFirstName, $contactLastName, $contactEmail, $contactPhoneNumber);
			$stmt2->execute();
			$result2 = $stmt2->get_result();
			$stmt2->close();

			if($row2 = $result2->fetch_assoc())
			{
				returnWithError("Contact already exists");
			}
			else{
					$stmt3 = $conn->prepare("INSERT into Contacts(UserID, UserFirstName, UserLastName, ContactFirstName, ContactLastName, ContactEmail, ContactPhoneNumber) VALUES(?,?,?,?,?,?,?)");
					$stmt3->bind_param("issssss", $userID, $userFirstName, $userLastName, $contactFirstName, $contactLastName, $contactEmail, $contactPhoneNumber);
					$stmt3->execute();
					printf("Error message: %s\n", mysqli_error($conn));
					$stmt3->close();
					returnWithSuccess();
			}
		}
		else
		{
			returnWithError("No such user exists");
			$conn->close();
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
		$retValue = '{"contactFirstName":"","contactLastName":"","contactEmail":"","contactPhoneNumber":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithSuccess ()
	{
		global $contactFirstName, $contactLastName, $contactEmail, $contactPhoneNumber;
		$retValue ='{"contactFirstName":"' . $contactFirstName . '","contactLastName":"' . $contactLastName . '","contactEmail":"' . $contactEmail . '","contactPhoneNumber":"' . $contactPhoneNumber . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
