<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Access-Control-Allow-Origin, Origin, Content-Type, X-Auth-Token , Authorization, Access-Control-Allow-Headers, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

$response = array();
$path = '../projects/';
$results = scandir($path);
$get_all_projects = array();
$get_project="";
$proj_plan = array();
$proj_photo = array();
$proj_front = array();
$projects_info = array();
$id = 0;

$project_list = array();

if(isset($_GET['pr'])) {
        $get_project = htmlspecialchars($_GET["pr"]);
    }

$project_exist=FALSE;
    foreach ($results as $result) {
                if ($result === '.' or $result === '..') continue;
                if (is_dir($path . '/' . $result)) {
                        $project_list[] = array('name'  => $result, 'id' => ($id++),
                                                'photo' => getElements($path . $result."/img/photo/", "*.jpg"),
                                                'img_intro' => 'projects/' . $result . "/img_intro/1.jpg",
                                                'plans' => getElements($path . $result."/img/plans/", "*.jpg"),
                                                'front' => getElements($path . $result."/img/front/", "*.jpg"),
                                                'info' => includeInfo($path . $result)
                        );
                    }
                }


function getElements($path, $pattern)
{
    $func = function ($str){
        return substr($str,3,strlen($str));
    };

    $arr = glob($path.$pattern);
    return array_map($func, $arr);
}

function includeInfo($path)
{
    $proj_information = include($path."/info/info.php");
    return $proj_information;
}

echo json_encode($project_list);


function utf8ize($d)
{
    if (is_array($d) || is_object($d))
        foreach ($d as &$v) $v = utf8ize($v);
    else
        return utf8_encode($d);
    return $d;
}

?>



