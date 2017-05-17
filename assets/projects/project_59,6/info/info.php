<?php

$foundation=array('name'=>'Foundations','text'=>array(
'Concrete columnar'));

$windows=array('name'=>'Windows','text'=>array(
       'Glued-laminated window frames from pine of 70x84 mm in section; window casing frame with thickness of 60 mm; outside window frame with thickness of 12 mm; woolen window shutters with thickness of 40 mm',
       'Three-layered energy saving glass unit',
       'Surface coating with ‘Adler” paints and antiseptics'));

$floor=array('name'=>'Floor','text'=>array(
        'Main beams of 120x200 (h) mm in section; cross beams of 100x180 (h) mm in section',
        'Wood board with thickness of 40 mm, “Gidrobarier” film; thermal insulation with thickness of 180 mm; “Parobarier” film',
        'Flooring board with thickness of 40 mm thick',
        'Surface coating with “Adler” paints and antiseptics'));

$roofing=array('name'=>'Roofing','text'=>array(
        'Ceramic tile',
        'Furring strips of 50x30 (h) mm in section; purlins of 50x30 (h) mm in section; “Gidrobarier” film; edged planed board with thickness of 25 mm thick',
        'Rafters of 100x200 (h) mm in section'));

$terrace=array('name'=>'Terrace','text'=>array(
                'Heat-treated main beams of 120x180 (h) mm in section; cross beams of 100x180 (h) mm in section ',
                'Terrace board from ash with thickness of 35 mm',
                'Surface coating with “Adler” paints and antiseptics'));

$external_doors=array('name'=>'Entrance door block','text'=>array(
                 'Glued-laminated door panel from pine of 70x115 mm in section;door casing frame with thickness of 60 mm; platband with thickness of 12 mm',
                 'Three-layered energy saving glass unit',
                 'Surface coating with “Adler” paints and antiseptics'));

 $internal_doors=array('name'=>'Interior door block','text'=>array(
                 'Glued-laminated door panel from pine with thickness of 40 mm  ',
                 'Door frame with thickness of 40 mm; door frame width corresponds wall width; platband with thickness of 12 mm',
                 'Surface coating with “Adler” paints and antiseptics'));

$walls=array('name'=>'Walls made from profiled bar','text'=>array(
          'Three-layered combined wooden bars of 130x160 mm in section; thermal insulation with thickness of 70 mm and false timber with thickness of 25 mm  along wooden frame',
          'Surface coating with “Adler” paints and antiseptics'));

$full_info=array($foundation,$walls,$floor,$roofing,$windows,$external_doors,$internal_doors,$terrace);


$short_info = array('main'=>array(
    'area'=> '59.6' ,'size'=>'9.69 х 7.09 m'
),
'secondary'=>array(
array('name'=>'Bedroom','amount'=>'2', 'value'=> array('7.28','8.01')),
array('name'=>'Bathroom', 'amount'=>'1', 'value'=> array('3.36')),
array('name'=>'Living room', 'amount'=>'1', 'value'=>array('23.16')),
array('name'=>'Hallway', 'amount'=>'1', 'value'=>array('8.10')),
array('name'=>'Terrace', 'amount'=>'1', 'value'=>array('8.84'))
)
);


$info=array('category'=>'Custom design','short'=>$short_info,'full'=>$full_info);
return $info;


?>



