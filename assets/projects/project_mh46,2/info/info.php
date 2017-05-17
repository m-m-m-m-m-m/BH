<?php

$foundation=array('name'=>'Foundations','text'=>array(
'Galvanized screw piles'));

$windows=array('name'=>'Windows','text'=>array(
        'Glued-laminated window frames of 70x84 mm in section; casing frame with thickness of 60 mm; platband with thickness of 12 mm; wooden shutters with thickness of 40 mm',
        'Three-layered energy saving glass unit',
        'Surface coating with “Adler” paints and antiseptics'));

$floor=array('name'=>'Floor','text'=>array(
        'Main beams of 100x150 (h) mm in section; cross beams of 50x150 (h) mm in section',
        'Wooden board with thickness of 25 mm, “Gidrobarier” film; thermal insulation “Icynene” with thickness of 180 mm; “Parobarier” film , flooring board with thickness of 35 mm',
        'Surface coating with “Adler” paints and antiseptics'));

$roofing=array('name'=>'Roofing','text'=>array(
        'Corrugated galvanized irons roofing 20 PP',
        'Furring strips of 50x30 (h) mm in section',
        'Purlins of 50x30 (h) mm in  section',
        '”Godrobarier” film',
        'Rafters of 50x150 (h) mm in section; thermal insulation “Icynene” with thickness of 180 mm; “Parobarier” film; deal board for ceiling with thickness of 16 mm '
        ));

$terrace=array('name'=>'Terrace','text'=>array(
                'Main beams of 100x150 (h) mm in section; cross beams of 50x150 (h) mm in section',
                'Heat-treated terrace board from ash with thickness of 35 mm',
                'Surface coating with “Adler” paints and antiseptics'));

$external_doors=array('name'=>'Entrance door block','text'=>array(
                'Glued-laminated door panel from pine of 70x115 mm in section; casing frame with thickness of 60 mm; platband with thickness of 12 mm',
                'Three-layered energy saving glass unit',
                'Surface coating with “Adler” paints and antiseptics'));

$internal_doors=array('name'=>'Interior door block','text'=>array(
                'Glued-laminated door panel from pine with thickness of 40 mm ',
                'door frame with thickness of 40 mm, door frame width is according to wall width; platband with thickness of 12 mm',
                'Surface coating with “Adler” paints and antiseptics'));

$walls=array('name'=>'Walls','text'=>array(
          'False timber with thickness of 25 mm; frame fromboard of 50x150 mm; “Gidrobarier” film; thermal insulation with thickness of 150 mm; “Parobarier” film; deal board with thickness of 16 mm',
          'Surface coating with “Adler” paints and antiseptics'));

$full_info=array($foundation,$walls,$floor,$roofing,$windows,$external_doors,$internal_doors,$terrace);

$short_info = array('main'=>array(
'area' => '46.2', 'size'=>'7.5 x 6.2 m'
),
'secondary'=>array(
array('name'=>'Bedroom','amount'=>'2', 'value'=> array('7.25','4.72')),
array('name'=>'Bathroom', 'amount'=>'1', 'value'=> array('3.78')),
array('name'=>'Living room', 'amount'=>'1', 'value'=>array('23.32')),
array('name'=>'Terrace', 'amount'=>'1', 'value'=>array('22.5'))
)
);


$info=array('category'=>'Modular house','short'=>$short_info,'full'=>$full_info);
return $info;


?>



