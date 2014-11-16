
<?php

class E {
	var $name;
	var $id;
}

function deal($content, $which) {
    $lines = explode("\n", $content);

//for($k=0; $k<count($lines); $k++) {
    for($k=0; $k<100; $k++) {
        $temp = str_replace("(","",$lines[$k]);
        $temp = str_replace(")","",$temp);  //将()替换为空格以便统计单词数
        $words = explode(" ",$temp);
        $count = count($words);     //统计一共有多少单词

        $sentence = str_replace("(","( ",$lines[$k]);
        $sentence = str_replace(")"," )",$sentence);
        $words = explode(" ",$sentence);    //分割成一个个单词

        $stack = array();
        $a= array();
        $index = 0;
        for($i=0;$i<$count;$i++) {
            $a[$i]['children'] = array();
            $a[$i]['text'] = '';
            $a[$i]['order'] = $i+1;
        }
        for($i=0; $i<count($words); $i++) {
            if($words[$i] == "(") {     //遇到 ( 入栈
                $i++;
                $e = new E();
                $e->id = $index;
                $e->name = $words[$i];
                array_push($stack,$e);
                $a[$index]['name'] = $words[$i];
                $index++;
            } elseif ($words[$i] == ")") {  //遇到 ) 出栈
                if(count($stack) > 1) {
                    $e = array_pop($stack);
                    $ep = $stack[count($stack)-1];
                    $a[$ep->id]['children'][] = &$a[$e->id];
                }
            } else {    //遇到单词或者单词成分则进栈
                $a[$index]['name'] = $words[$i];
                $e = $stack[count($stack)-1];
                $a[$e->id]['children'][] = &$a[$index];
                $index++;
                for($t=0;$t<count($stack);$t++) {
                    $a[$stack[$t]->id]['text'].=' '.$words[$i];
                }
            }
        }
        $root=&$a[0];
//        var_dump($a);

        $fp1 = null;
        if($which == 'devr') {
            $fp1 = fopen('../dst/cfg_devr'.($k+1).'.json', "w");//文件被清空后再写入
        } else {
            $fp1 = fopen('../dst/cfg_devo'.($k+1).'.json', "w");//文件被清空后再写入
        }
        $flag=fwrite($fp1,JSON($root));
        if(!$flag)
        {
            echo "写入文件失败<br>";
            break;
        } else {
            echo JSON($root).'<br><br>';
        }
    }
}

require_once('json.php');
$content_o = file_get_contents('../source/cfg_devo.txt');
$content_r = file_get_contents('../source/cfg_devr.txt');

deal($content_o, 'devo');
deal($content_r, 'devr');

?>