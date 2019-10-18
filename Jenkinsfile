node('nodejs-slave-123-nodejs10||nodejs-slave-140-nodejs10') {
    def docker_push_repo_url = '192.168.99.123:10001'
    def docker_pull_repo_url = '192.168.99.123:10000'
    def docker_compose_path = '/root/docker/docker-compose/hbd'
    def docker_compose_service = 'jxportlet-frontend'

    def docker_image_name
    def tag = BUILD_ID
    def project_runtime

    // 开发、测试服务器地址
    def remote_servers = ['test': '192.168.99.148']

    stage('Settings branch params') {
        println "设置分支参数"
        if (BRANCH_NAME == 'master') {
            // 设置构建保留的最大个数，超过指定的个数则丢弃
            properties([buildDiscarder(logRotator(numToKeepStr: '7'))])
            docker_image_name = 'microservice/jiaxiang/portlet-frontend'
            project_runtime = 'miyun_yanshi'
        } else if (BRANCH_NAME == 'develop') {
            // 设置构建保留的最大个数，超过指定的个数则丢弃
            properties([buildDiscarder(logRotator(numToKeepStr: '3'))])
            docker_image_name = 'microservice/jiaxiang/dev/portlet-frontend'
            project_runtime = ''
        } else if (BRANCH_NAME == 'test') {
            // 设置构建保留的最大个数，超过指定的个数则丢弃
            properties([buildDiscarder(logRotator(numToKeepStr: '3'))])
            docker_image_name = 'microservice/jiaxiang/test/portlet-frontend'
            project_runtime = ''
         }  else {
            error("分支参数设置错误，当前分支：$BRANCH_NAME")
            currentBuild.result = 'ABORTED'
        }
    }

    nodejs('Nodejs6') {
        stage('Preparation') {
            sh 'node -v'
            sh 'npm -v'
            nrm_status = sh returnStatus: true, script: 'nrm ls'
            if (nrm_status > 0) {
                sh 'npm install -g nrm'
                sh 'nrm use taobao'
            } else {
                sh 'nrm use taobao'
            }
        }
        stage('Checkout code') {
            // 拉取最新的代码
            checkout scm
        }
        stage('Install package') {
            sh 'nrm ls'
            sh 'npm install'
        }
        stage('Build code') {
            sh "PROJECT_NAME=${project_runtime} npm run build"
        }
    }

    stage('Archive') {
        echo '归档构建'
        sh 'tar cfz dist.tar.gz dist'
        archive 'dist.tar.gz'
    }

    stage('Build image') {
        echo '构建 Docker 镜像'
        sh "cp dist.tar.gz docker"
        dir('docker') {
            // 根据 Jenkins 最新运行的 Build id 构建模块 Docker 镜像
            sh "docker build -t ${docker_push_repo_url}/${docker_image_name}:${tag} ."
            //  生成 latest 版本 Docker 镜像
            sh "docker tag ${docker_push_repo_url}/${docker_image_name}:${tag} " +
                    "${docker_push_repo_url}/${docker_image_name}:latest"
        }
    }

    stage('Push image') {
        echo '上传 Docker 镜像'
        withCredentials([usernamePassword(credentialsId: 'docker',
                passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]) {
            sh "docker login -u ${USERNAME} -p ${PASSWORD} ${docker_push_repo_url}"
            sh "docker push ${docker_push_repo_url}/${docker_image_name}:${tag}"
            sh "docker push ${docker_push_repo_url}/${docker_image_name}:latest"
        }
    }

    stage('Clean local image') {
        echo '清理 Build 后的本地镜像'
        def images_id = sh(returnStdout: true,
                script: "docker images -q ${docker_push_repo_url}/${docker_image_name}")
                .split("\r?\n")
        def images_id_set = images_id as Set
        sh "docker rmi -f ${images_id_set.join(' ')}"
    }

    if (BRANCH_NAME == 'test') {
        stage('Remote server redeploy') {
            println "重新部署远程服务器：${BRANCH_NAME}，IP：${remote_servers[BRANCH_NAME]}"
            withCredentials([usernamePassword(credentialsId: 'docker',
                    passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]) {
                sshagent(credentials: ['ssh-server']) {
                    def command = """
                            uname -a;
                            cd ${docker_compose_path};
                            docker login -u ${USERNAME} -p ${PASSWORD} ${docker_pull_repo_url};
                            docker-compose stop ${docker_compose_service};
                            docker-compose rm -f ${docker_compose_service};
                            docker pull ${docker_pull_repo_url}/${docker_image_name}:latest;
                            docker-compose up -d ${docker_compose_service}
                        """
                    sh """ssh root@${remote_servers[BRANCH_NAME]} "$command" """
                }
            }
        }
    }

}
