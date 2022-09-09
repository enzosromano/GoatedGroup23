<?php
	$inData = getRequestInfo();
	
	$login = $inData["login"];
	$password = $inData["password"];

	$conn = new mysqli("localhost", "TheGuy", "Group23IsGoated", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt1 = $conn->prepare("SELECT ID FROM Users WHERE Login=? AND Password=?");
		$stmt1->bind_param("ss", $login, $password);
		$stmt1->execute();
		$return = $stmt1->get_result();

		$stmt1->close();

		if($row = $return->fetch_assoc())
		{
			$stmt2 = $conn->prepare("DELETE FROM Users WHERE Login=? AND Password=?" );
			$stmt2->bind_param("ss", $login, $password);
			$stmt2->execute();
			$stmt2->close();

			returnWithSuccess();

		}
		else
		{
			returnWithError("User does not exist!");
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	function returnWithSuccess ()
	{
		$retValue ='{"message":"Successfully deleted User"}';
		sendResultInfoAsJson( $retValue );
	}
	

?>