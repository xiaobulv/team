<?php

namespace Addons\team;
use Common\Controller\Addon;

/**
 * 团队介绍插件
 * @author 国峰
 */

    class teamAddon extends Addon{

        public $info = array(
            'name'=>'team',
            'title'=>'团队介绍',
            'description'=>'团队介绍',
            'status'=>1,
            'author'=>'国峰',
            'version'=>'0.1'
        );

        public function install(){
            return true;
        }

        public function uninstall(){
            return true;
        }

        //实现的single钩子方法
        public function single($param){

        }

    }