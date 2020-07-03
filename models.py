from django.db import models
from DjangoUeditor.models import UEditorField
from django.contrib.auth.models import AbstractUser


# Create your models here.


class User(AbstractUser):
    phone = models.CharField(max_length=20, verbose_name="手机号", blank=True)
    mod_date = models.DateTimeField(verbose_name='最后修改时间', auto_now=True)

    class Meta:
        verbose_name = '用户'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.username


# 用户token模型，一对一
# class UserToken(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     token = models.CharField('用户token', max_length=128)
#

class Author(models.Model):
    """作者"""
    sex = (
        ('male', '男'),
        ('female', '女'),
        ('secrecy', '保密')
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="作者对应的用户", related_name="user_author")
    sex = models.CharField(choices=sex, max_length=7, verbose_name="性別", default='secrecy')
    age = models.IntegerField(verbose_name="年龄", default=0)
    sign = UEditorField(max_length=255, verbose_name="签名", width="500", height="200", blank=True, null=True,
                        default="这个人很懒，还没有签名~")
    touxian = models.CharField(max_length=20, verbose_name="头衔", default="初级学习员")
    headimg = models.ImageField(verbose_name="头像", upload_to='headimg', default="headimg/morentouxiang.jpg",
                                blank=True, null=True)
    address = models.CharField(max_length=50, verbose_name="地址", default="火星")

    class Meta:
        verbose_name = "作者信息"
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.user.username


class Category(models.Model):
    status = (
        ('true', '有效'),
        ('false', '无效')
    )
    name = models.CharField(max_length=20, verbose_name="分类名", default="")
    parent_id = models.ForeignKey('self', max_length=11, verbose_name="父级菜单", on_delete=models.CASCADE,
                                  related_name="category")
    jianjie = models.CharField(max_length=255, verbose_name="简介", default="暂无简介")
    status = models.CharField(choices=status, max_length=10, verbose_name="状态", default="checked")

    class Meta:
        verbose_name = "文章分类"
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.name


class Article(models.Model):
    """文章"""
    recommend = (
        ('false', '不推荐'),
        ('true', '推荐')
    )
    top = (
        ('false', '不置顶'),
        ('true', '置顶')
    )
    status = (
        ('checked', '无需审核'),
        ('delete', '已删除'),
        ('draft', '草稿'),
        ('-', '需审核')
    )
    title = models.CharField(max_length=50, verbose_name="标题")
    author = models.ForeignKey(Author, on_delete=models.CASCADE, verbose_name="作者", related_name="author_article")
    time = models.DateTimeField(auto_now_add=True, verbose_name="发布时间")
    updated = models.DateTimeField(auto_now=True, verbose_name="更新时间")
    count = models.IntegerField(verbose_name="查看数", default=0)
    content = UEditorField(verbose_name='文章内容', default='这里填写文章信息哦~', blank=True, null=True)
    recommend = models.CharField(choices=recommend, max_length=10, verbose_name="推荐", default="-")
    top = models.CharField(choices=top, max_length=10, verbose_name="置顶", default="-")
    category = models.ForeignKey(Category, verbose_name="分类", on_delete=models.CASCADE, related_name="category_article")
    status = models.CharField(choices=status, max_length=10, verbose_name="状态", default="checked")

    class Meta:
        verbose_name = "文章信息"
        verbose_name_plural = verbose_name
        ordering = ('-time',)

    def __str__(self):
        return self.title


class Comment(models.Model):
    status = (
        ('checked', '无需审核'),
        ('delete', '已被删除'),
        ('-', '需审核')
    )

    author = models.ForeignKey(Author, verbose_name="评论人", on_delete=models.CASCADE, related_name="author_comment")
    article = models.ForeignKey(Article, verbose_name="被评论文章", on_delete=models.CASCADE, related_name="article_comment")
    content = UEditorField(verbose_name='评论内容', default='这里填写评论内容哦~', blank=True, null=True)
    parent_id = models.IntegerField(verbose_name="回复给哪条子评论", blank=True, null=True)  # 若本身就是回复的主评论则为""
    reply_id = models.IntegerField(verbose_name="回复给哪条主评论", blank=True, null=True)  # 若本身就是主评论则为""
    time = models.DateTimeField(auto_now_add=True, verbose_name="评论时间")
    status = models.CharField(choices=status, max_length=10, verbose_name="状态", default="checked")

    class Meta:
        verbose_name = "评论信息"
        verbose_name_plural = verbose_name
        ordering = ('-time',)

    def __str__(self):
        return self.content

    def 评论内容(self):
        if (len(str(self.content)) > 30):
            return "{}...".format(str(self.content)[:30])
        else:
            return self.content

    评论内容.allow_tags = True


class LikeAndCollect(models.Model):
    """喜欢和收藏"""
    status = (
        ('true', '已喜欢/已收藏'),
        ('false', '未收藏/未喜欢'),
    )
    author = models.ForeignKey(Author, verbose_name="喜欢/收藏人", on_delete=models.CASCADE, )
    article = models.ForeignKey(Article, verbose_name="被喜欢/收藏文章", on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now=True, verbose_name="收藏时间")
    like_status = models.CharField(choices=status, verbose_name="喜欢状态", max_length=10)
    collect_status = models.CharField(choices=status, verbose_name="收藏状态", max_length=10)

    class Meta:
        verbose_name = "喜欢/收藏"
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.article.title


def get_url(instance, filename):
    type = instance.type
    author_id = instance.author.id
    print('%s/%s/%s' % (type, author_id, filename))
    return '%s/%s/%s' % (type, author_id, filename)


class MediaFile(models.Model):
    """文件"""
    type = (
        ("image", "图片"),
        ("video", "视频"),
        ("audio", "音频"),
        ("txt", "文本"),
        ("other", "其他"),
    )
    author = models.ForeignKey(Author, verbose_name="上传者", on_delete=models.CASCADE)
    title = models.CharField(verbose_name="标题", max_length=50, default="附件")
    url = models.FileField(upload_to=get_url, verbose_name="地址")
    count = models.BigIntegerField(verbose_name="下载量", default=0)
    type = models.CharField(choices=type, verbose_name="类型", max_length=10, default="other")
    size = models.FloatField(verbose_name="文件大小", default=0)
    time = models.DateTimeField(auto_now=True, verbose_name="上传时间")

    class Meta:
        verbose_name = "文件管理"
        verbose_name_plural = verbose_name
        ordering = ('-time',)

    def __str__(self):
        return self.title


class Address(models.Model):
    id = models.IntegerField(primary_key=True, default=0)
    name = models.CharField(max_length=40, verbose_name="省市区名称", default="")
    parentid = models.ForeignKey('self', max_length=11, verbose_name="父ID", on_delete=models.CASCADE)
    shortname = models.CharField(max_length=40, verbose_name="简称", default="")
    leveltype = models.CharField(max_length=2, verbose_name="级别:0,中国；1，省分；2，市；3，区、县", default="")
    citycode = models.CharField(max_length=7, verbose_name="城市代码", default="")
    zipcode = models.CharField(max_length=7, verbose_name="邮编", default="")
    lng = models.CharField(max_length=20, verbose_name="经度", default="")
    lat = models.CharField(max_length=20, verbose_name="纬度", default="")
    pinyin = models.CharField(max_length=40, verbose_name="拼音", default="")
    status = models.CharField(max_length=10, verbose_name="状态", default='1')

    class Meta:
        verbose_name = "地址"
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.name


class VerificationCode(models.Model):
    send_choices = (
        ('register', '注册'),
        ('find-password', '找回密码'),
        ('change-blind', '更换绑定'),
    )
    type = {
        ('email', '邮箱'),
        ('phone', '手机号'),
    }
    code = models.CharField('验证码', max_length=20)
    info = models.CharField('邮箱/手机号', max_length=50)
    method = models.CharField('发送方式', choices=type, max_length=10)
    type = models.CharField('发送类型', choices=send_choices, max_length=20)
    time = models.DateTimeField('发送时间', auto_now_add=True)

    class Meta:
        verbose_name = '邮箱验证码'
        verbose_name_plural = verbose_name
        ordering = ('-time',)


class Banner(models.Model):
    """轮播图片"""
    status = {
        ('true', '可用'),
        ('false', '禁用')
    }
    title = models.CharField('标题', max_length=100)
    image = models.ImageField('轮播图', upload_to='banner/%Y%m', max_length=200)
    url = models.URLField('访问地址', max_length=200)
    index = models.IntegerField('顺序', default=1)
    status = models.CharField('状态', choices=status, max_length=10)
    time = models.DateTimeField('添加时间', auto_now_add=True)

    class Meta:
        verbose_name = '轮播图'
        verbose_name_plural = verbose_name


class LoginHistory(models.Model):
    """登录历史"""
    author = models.ForeignKey(Author, verbose_name="登录用户", on_delete=models.CASCADE)
    ip = models.CharField(max_length=20, verbose_name="登录IP")
    address = models.CharField(max_length=100, verbose_name="登录地点")
    device = models.CharField(max_length=50, verbose_name="登录设备")
    time = models.DateTimeField(auto_now=True, verbose_name="登录时间")

    class Meta:
        verbose_name = "登录历史"
        verbose_name_plural = verbose_name
        ordering = ('-time',)
