<?php
	$inData = getRequestInfo();
	
	$userID = $inData["userID"];
	$userFirstName = $inData["userFirstName"];
	$userLastName = $inData["userLastName"];
	$contactFirstName = $inData["contactFirstName"];
	$contactLastName = $inData["contactLastName"];
	$contactEmail = $inData["contactEmail"];
	$contactPhoneNumber = $inData["contactPhoneNumber"];
	$newFirstName = $inData["newContactFirstName"];
	$newLastName = $inData["newContactLastName"];
	$newEmail = $inData["newContactEmail"];
	$newPhoneNumber = $inData["newContactPhoneNumber"];

	$conn = new mysqli("localhost", "TheGuy", "Group23IsGoated", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt1 = $conn->prepare("SELECT EntryNumber FROM Contacts WHERE UserID=? AND UserFirstName=? AND UserLastName=? AND ContactFirstName=? AND ContactLastName=? AND ContactEmail=? AND ContactPhoneNumber=?");
		$stmt1->bind_param("issssss", $userID, $userFirstName, $userLastName, $contactFirstName, $contactLastName, $contactEmail, $contactPhoneNumber);
		// printf("%d\n%s\n%s\n%s\n%s\n%s\n%s\n", $userID, $userFirstName, $userLastName, $contactFirstName, $contactLastName, $contactEmail, $contactPhoneNumber);
		$stmt1->execute();
		$result = $stmt1->get_result();
		$stmt1->close();

		if($row = $result->fetch_assoc()) {

			$entryNumber = $row["EntryNumber"];
			
			// printf("Entry Number : %d\n", $entryNumber);

			$stmt2 = $conn->prepare("UPDATE Contacts SET ContactFirstName=?, ContactLastName=?, ContactEmail=?, ContactPhoneNumber=? WHERE EntryNumber=?");
			$stmt2->bind_param("ssssi", $newFirstName, $newLastName, $newEmail, $newPhoneNumber, $entryNumber);
			
			if($success = $stmt2->execute()) {
				returnWithSuccess();
			}
			else{
				returnWithError("Could not update table");
			}

			$stmt2->close();

			

		}
		else {
			returnWithError("Contact does not exist");
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
		global $newFirstName, $newLastName, $newEmail, $newPhoneNumber;
		$retValue ='{"contactFirstName":"' . $newFirstName . '","contactLastName":"' . $newLastName . '","contactEmail":"' . $newEmail . '","contactPhoneNumber":"' . $newPhoneNumber . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
