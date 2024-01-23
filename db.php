<?php
class Database
{
    private $servername;
    private $username;
    private $password;
    private $dbname;
    protected $conn;

    public function __construct()
    {
        $this->servername = "localhost";
        $this->username = "root";
        $this->password = "root";
        $this->dbname = "eksamens";

        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);

        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    public function GetMessages()
    {
        $items = [];

        $sql = "SELECT * FROM users";
        $stmt = $this->conn->prepare($sql);

        if ($stmt) {
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result) {
                while ($row = $result->fetch_assoc()) {
                    $items[] = $row;
                }
            } else {
                error_log("Error getting result: " . $stmt->error);
            }

            $stmt->close();
        } else {
            error_log("Error preparing statement: " . $this->conn->error);
        }

        return $items;
    }

    public function InsertMessage($name, $email, $message)
    {
        $sql = "INSERT INTO users (name, email, message, submission_date) VALUES (?, ?, ?, NOW())";
        $stmt = $this->conn->prepare($sql);

        if ($stmt) {
            $stmt->bind_param("sss", $name, $email, $message);

            if (!$stmt->execute()) {
                error_log("Error executing statement: " . $stmt->error);
            }

            $stmt->close();
        } else {
            error_log("Error preparing statement: " . $this->conn->error);
        }
    }


    // Add more methods as needed

}
