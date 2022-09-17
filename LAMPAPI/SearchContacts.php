<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$userID = $inData["userID"];
	$userFirstName = $inData["userFirstName"];
	$userLastName = $inData["userLastName"];

	$conn = new mysqli("localhost", "TheGuy", "Group23IsGoated", "COP4331");


	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT ContactFirstName,ContactLastName,ContactEmail,ContactPhoneNumber FROM Contacts WHERE UserID=? AND UserFirstName=? AND UserLastName=?");
		$stmt->bind_param("sss", $userID, $userFirstName, $userLastName);
		$stmt->execute();
		$result = $stmt->get_result();

		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}

			$searchCount++;
			$searchResults .= '{"contactFirstName":"' . $row["ContactFirstName"] . '","contactLastName":"' . $row["ContactLastName"] . '","contactEmail":"' . $row["ContactEmail"] . '","contactPhoneNumber":"' . $row["ContactPhoneNumber"] . '"}';
		}

		if( $searchCount == 0 )
		{
			returnWithError( "No Contacts Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}

		$stmt->close();
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
		$retValue = '{"results":[],"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
